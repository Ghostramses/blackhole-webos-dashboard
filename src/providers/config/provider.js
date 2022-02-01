import { api } from '../../../config.json';

export const config = {
  mainBackendUrl: api.url,
  socket: {
    url: api.socket.url,
    path: api.socket.path
  }
};
