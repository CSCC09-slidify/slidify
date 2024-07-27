const module = {};

// checks token info
module.validateToken = async ({ authToken }) => {
  return fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${authToken}`,
  )
    .then((res) => res.json())
    .then(({ expires_in }) => expires_in > 60);
};

// checks token info
module.getUserProfile = async ({ authToken }) => {
  return fetch(
    `https://openidconnect.googleapis.com/v1/userinfo?access_token=${authToken}`,
  ).then((res) => res.json());
};

export default module;
