import { create } from "apisauce";
import apiMonitor from "./apiMonitor";


const BaseURL = 'https://slstage.lb.slrb.in/v1/';


let api = create({
  baseURL: BaseURL,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

 api.addMonitor(apiMonitor);

  
export const setAuthorizationHeader = (access_token) =>
    api.setHeader("Authorization", "Bearer " + access_token);

export const setHeaderActiveSession = (session) =>
  api.setHeader('session', session);

export const setHeaderSchoolId = (id) =>
  api.setHeader('sid', id);

export const removeAuthorizationHeader = () => {
  delete api.headers['Authorization'];
};

export const removeHeaderActiveSession = () => {
  delete api.headers['session'];
};



export {api as apiClient};


export const URIS = {
  LOGIN: 'login/parent',
  LOGOUT: 'logout/parent-app',
 
};