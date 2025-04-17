import { BaseUserApiUrl } from "@/constants/Url";
import apiUser from "./axiosApi";

export const getUser = async () => {
  try {
    var response = await apiUser.get(BaseUserApiUrl + '/v1/');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const login = (userName: string, password: string) => {
  return fetch(BaseUserApiUrl + '/login/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ "username": userName, "password": password }),
  })
    .then(response => response.json())
    .then(user => user)
    .catch(error => {
      console.error(error);
    });
}


export const register = (userName: string, password: string, name: string, surname: string, image: any) => {
  const formData = new FormData();
  formData.append('userName', userName);
  formData.append('password', password);
  formData.append('name', name);
  formData.append('surname', surname);
  formData.append('image', {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as any);
  return fetch(BaseUserApiUrl + '/register/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData,
  })
    .then(response => response.json())
    .then(user => user)
    .catch(error => {
      console.error(error);
    });
}


export const uploadProfileImage = async (image: any) => {
  const formData = new FormData();
  formData.append('image', {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as any);
  return apiUser.patch(BaseUserApiUrl+'/v1/updateprofile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
