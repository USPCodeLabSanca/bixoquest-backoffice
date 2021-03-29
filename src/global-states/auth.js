import React from 'react';
import API from '../api';

const authContext = React.createContext();

const initialState = {
  user: null,
  token: null,
};

let auth; let setAuth;

/**
 * AuthProvider
 *
 * @param {object} props
 *
 * @return {object}
 */
export default function AuthProvider(props) {
  const state = React.useState(() => ({
    ...initialState,
    user: JSON.parse(localStorage.getItem('user')),
    token: JSON.parse(localStorage.getItem('token')),
  }));

  auth = state[0];
  setAuth = state[1];

  localStorage.setItem('user', JSON.stringify(auth.user));
  localStorage.setItem('token', JSON.stringify(auth.token));

  return (
    <authContext.Provider {...props} value={auth} />
  );
}

/**
 * getToken
 *
 * @return {string}
 */
export function getToken() {
  return auth.token;
}

/**
 * useAuth
 *
 * @return {object}
 */
export function useAuth() {
  return React.useContext(authContext);
}

/**
 * setToken
 *
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem('token', token);
  setAuth({...auth, token});
}

/**
 * login
 *
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  const {data: user, headers: {authorization: token}} = await API.login(email, password);
  setAuth({token, user});
}

/**
 * login
 *
 * @param {string} name
 * @param {string} email
 * @param {string} course
 * @param {string} password
 * @param {string} key
 */
export async function signup(name, email, course, password, key) {
  const {data: user, headers: {authorization: token}} = await API.signup(name, email, course, password, key);
  setAuth({token, user});
}

/**
 * logout
 */
export function logout() {
  setAuth({...initialState});
}
