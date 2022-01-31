import { instance } from '../instance';

export const login = data => instance.post('/public/authenticate', data);

export const logout = () => instance.post('/my_account/logout');
