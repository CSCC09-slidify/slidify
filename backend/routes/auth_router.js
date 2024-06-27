import { Router } from "express";
import { OAuth2Client } from "google-auth-library";

export const authRouter = Router();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // see: https://stackoverflow.com/questions/11485271/google-oauth-2-authorization-error-redirect-uri-mismatch
  redirectUri: "postmessage",
});

authRouter.post("/signin", async (req, res) => {
  // an id token
  const code = req.body.code;
  if (!code) {
    return res
      .status(400)
      .json({ error: "OAuth2 authorization code is required" });
  }
  try {
    const { tokens } = await client.getToken(code);

    // authenticate user
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
    });
    const payload = ticket.getPayload();
    // use this as unique identifier for the user
    // const userId = payload["sub"];

    /*
    TODO:
    - check if user already in database
    - if so, establish a session
    - otherwise, create a new user record and establish a session
    */

    client.setCredentials({ access_token: tokens.access_token });

    return res.status(200).json({
      message: "User authenticated",
      user: payload,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid authorization code" });
  }
});

authRouter.get("/slides", async (req, res) => {
  let authorizationUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/presentations",
    include_granted_scopes: true,
  });
  authorizationUrl = authorizationUrl.replace("postmessage", process.env.GOOGLE_REDIRECT_URI);
  res.redirect(authorizationUrl);
});
