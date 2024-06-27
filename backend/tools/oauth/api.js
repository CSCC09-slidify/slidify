const module = {}

// checks token info
module.validateToken = async ({authToken}) => {
    return fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${authToken}`)
            .then(res => res.json())
            .then(({expires_in}) => expires_in > 60);
}

export default module;