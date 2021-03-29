import API from './base-api';

/** @template T @typedef { import('axios').AxiosResponse<T> } AxiosResponse */

const Handlers = {
  login: (email, password) => API.post('/backoffice/auth/login', {email, password}),

  getUser: () => API.get('/backoffice/users'),

  getMissions: () => API.get('/backoffice/missions'),

  createMissions: (mission) => API.post('/backoffice/missions', mission),

  editMissions: (mission) => API.put('/backoffice/missions/' + mission._id, mission),

  deleteMission: (missionId) => API.delete('/backoffice/missions/' + missionId),
};

export default Handlers;
