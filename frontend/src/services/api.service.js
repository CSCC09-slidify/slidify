"use strict";

// TODO: remove hardcoded API endpoint
const BASE_URL = "http://localhost:3000";

const apiService = {};

apiService.signIn = function (idToken) {
  return fetch(BASE_URL + "/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: idToken,
    }),
  }).then((response) => response.json());
};

export default apiService;
