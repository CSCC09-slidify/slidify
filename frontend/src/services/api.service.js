"use strict";

// TODO: remove hardcoded API endpoint
const BASE_URL = "http://localhost";

const apiService = {};

apiService.signIn = function (code) {
  return fetch(BASE_URL + "/api/users/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
    }),
  }).then((response) => response.json());
};

apiService.createSlides = function (title, file) {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(BASE_URL + `/api/slides?title=${title}`, {
    method: "POST",
    body: formData,
  }).then((response) => response.json());
};

apiService.whoami = function () {
  return fetch(BASE_URL + "/api/users/whoami", {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
}

export default apiService;
