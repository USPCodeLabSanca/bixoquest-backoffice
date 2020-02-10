import API from './base-api'
import { withCustomError } from './error-message'

/** @template T @typedef { import('axios').AxiosResponse<T> } AxiosResponse */

/** @template T @typedef { Promise<AxiosResponse<{
  message: string,
  success: boolean,
  data: T
}>> } APIResponse */

// const silentHandler = handler => withCustomError(handler, () => '_NO_ERROR_MESSAGE')

const Handlers = {
  login: () => new Promise(resolve => setTimeout(() => resolve({
    data: { name: 'asdasd' },
    headers: { authorization: 'TOKEN_AUTH' }
  }), 3000)),

  getUser: () => API.get('/backoffice/users'),

  getMissions: () => API.get('/backoffice/missions'),

  createMissions: (mission) => API.post('/backoffice/missions', mission),

  editMissions: (mission) => API.put('/backoffice/missions/' + mission._id, mission),

  deleteMission: (missionId) => API.delete('/backoffice/missions/' + missionId)
}

export default Handlers
