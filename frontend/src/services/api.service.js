"use strict";

// TODO: remove hardcoded API endpoint
const BASE_URL = process.env.VUE_APP_API_URL;

const apiService = {};

apiService.signIn = function (code) {
  return fetch(BASE_URL + "/api/users/signin", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
    }),
  }).then((response) => response.json());
};

apiService.createSlidesFromVideo = function (title, file) {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(BASE_URL + `/api/slides/fromVideo?title=${title}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  }).then((response) => response.json());
};

apiService.createSlidesFromText = function (title, text) {
  return fetch(BASE_URL + `/api/slides/fromText?title=${title}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
    }),
  }).then((response) => response.json());
};

apiService.getSlides = function () {
  return fetch(BASE_URL + `/api/slides`, {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.getSlide = function (slideId) {
  return fetch(BASE_URL + `/api/slides/${slideId}`, {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.getSlideJobs = function () {
  return fetch(BASE_URL + `/api/slides/jobs/active`, {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.watchJob = function (jobId) {
  return fetch(BASE_URL + `/api/slides/jobs/watch/${jobId}`, {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.clearNotifications = function () {
  return fetch(BASE_URL + `/api/notifications/readAll`, {
    method: "POST",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.fetchNotifications = function () {
  return fetch(BASE_URL + `/api/notifications/active`, {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.whoami = function () {
  return fetch(BASE_URL + "/api/users/whoami", {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.signOut = function () {
  return fetch(BASE_URL + "/api/users/signout", {
    method: "POST",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.getUserProfile = function () {
  return fetch(BASE_URL + "/api/users/profile", {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.getUserSettings = function () {
  return fetch(BASE_URL + "/api/users/settings", {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

apiService.updateUserSettings = function (settings) {
  return fetch(BASE_URL + "/api/users/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(settings)
  }).then((response) => response.json());
};

apiService.deleteAccount = function () {
  return fetch(BASE_URL + "/api/users", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  }).then((response) => response.json());
}


export default apiService;
