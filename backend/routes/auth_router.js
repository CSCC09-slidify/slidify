import { Router } from "express";
import { OAuth2Client } from "google-auth-library";

export const authRouter = Router();

const clientId = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(clientId);

authRouter.post("/signin", async (req, res) => {
  // an id token
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ error: "ID token is required" });
  }
  try {
    // see: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token#node.js
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    // use this as unique identifier for the user
    const userId = payload["sub"];

    /*
    TODO:
    - check if user already in database
    - if so, establish a session
    - otherwise, create a new user record and establish a session
    */

    return res.status(200).json({
      message: "User authenticated",
      user: payload,
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});
