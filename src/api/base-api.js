import axios from 'axios';
import {getDefaultMessage} from './error-message';

/**
@typedef { Object } APIConfig
@prop { string } baseURL
@prop { number } [timeout=60000]
@prop { (token: string) => void } tokenDispatcher A function to dispatch the token
to redux.
@prop { () => string } tokenSelector A function to get the token
@prop { () => void } onBadToken Callback called when a 401 response is received.
This is important because any 401 should always force the user to login again.
@prop { () => void } onError Callback called when an error occurs
*/

/** @type { import('axios').AxiosInstance } */
let globalAPI;

/**
 * initializeAPI
 *
 * @param {object} config
 *
 * @return {object}
 */
function initializeAPI(config) {
  const {
    baseURL,
    onBadToken = () => {},
    onError = () => {},
    tokenDispatcher,
    tokenSelector,
    timeout,
  } = config;

  const api = axios.create({
    timeout,
    baseURL,
  });

  // Sends a token if there's one in redux
  api.interceptors.request.use((request) => {
    const token = tokenSelector();
    if (token) request.headers.authorization = 'bearer ' + token;
    return request;
  });

  // Updates token if 'Authorization' header is filled
  api.interceptors.response.use((response) => {
    const token = response.headers.authorization;
    if (token) tokenDispatcher(token);
    return response;
  });

  // Handle errors
  api.interceptors.response.use((r) => r, (error) => {
    const response = error.response;
    if (response && response.status === 401) onBadToken();

    setTimeout(() => {
      if (!response) {
        onError(getDefaultMessage());
      } else {
        const message = response.errorMessage || getDefaultMessage(response);
        if (message !== '_NO_ERROR_MESSAGE') onError(message);
      }
    });

    throw response;
  });

  globalAPI = api;
  return api;
}

/** This proxy is to make sure the API has been initialized before being accessed
@type { import('axios').AxiosInstance } */
const APIProtectorProxy = new Proxy({}, {
  get(target, prop) {
    /**
     * This is because the CRA hot-reload feature will check every export if it's a React component.
     * In order to check this, they will try to access a property `$$typeof` of the object to see if it's
     * a component. Therefore, I added an exception to return null if this property is ever accessed.
     */
    if (prop === '$$typeof') return null;

    if (!globalAPI) throw new Error('Cannot access API before it\'s initialization');
    else return globalAPI[prop];
  },
});

export default APIProtectorProxy;
export {initializeAPI};
