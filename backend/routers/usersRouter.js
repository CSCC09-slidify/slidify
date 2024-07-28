import { Router } from "express";
import { User } from "../models/user.js";
import { OAuth2Client } from "google-auth-library";
import { validateUserCredentials } from "../middleware/auth.js";
import oauthApi from "../tools/oauth/api.js";
import { UserSettings } from "../models/userSettings.js";
import { defaultUserSettings } from "../constants/userSettings.js";

export const usersRouter = Router();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // see: https://stackoverflow.com/questions/11485271/google-oauth-2-authorization-error-redirect-uri-mismatch
  redirectUri: "postmessage",
});

usersRouter.post("/signin", async (req, res) => {
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
    const userId = payload["sub"];
    let user = await User.findOne({ where: { userId } });
    if (!user) {
      user = await User.create({
        userId: userId,
        name: payload["name"],
      });
      await UserSettings.create({
        config: defaultUserSettings,
        UserUserId: userId
      })
    }

    client.setCredentials({ access_token: tokens.access_token });
    req.session.userId = user.userId;
    // TODO: encrypt
    req.session.accessToken = tokens.access_token;
    req.session.refreshToken = tokens.refresh_token;
    const expiryDate = new Date(payload["exp"] * 1000);
    console.log("Google sessions expires at: " + expiryDate.toLocaleString());
    req.session.expiry = payload["exp"] * 1000;
    return res.json({
      userId: user.userId,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid authorization code" });
  }
});

usersRouter.post("/signout", async (req, res) => {
  // TODO: revoke tokens ?
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session:", err);
      return res.status(500).json({ error: "Failed to sign out" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Signed out successfully" });
  });
});

usersRouter.get("/whoami", async (req, res) => {
  // check if user is authenticated
  if (!req.session.userId) {
    return res.status(401).json({
      error: "User not authenticated",
    });
  }
  // find user in database
  const user = await User.findByPk(req.session.userId);
  if (!user) {
    return res.status(401).json({
      error: "User not authenticated",
    });
  } else if (req.session.expiry < Date.now()) {
    return res.status(401).json({
      error: "User session has expired",
    });
  }
  return res.json({
    userId: user.userId,
    name: user.name,
  });
});

usersRouter.delete("/", validateUserCredentials, async (req, res) => {
  const userId = req.session.userId;
  await User.destroy({
    where: {
      userId: userId,
    },
  });
  return res.status(204);
});

usersRouter.get("/profile", validateUserCredentials, async (req, res) => {
  oauthApi
    .getUserProfile({ authToken: req.session.accessToken })
    .then((profile) => {
      res.json({ profile });
    });
});

usersRouter.get("/settings", validateUserCredentials, async (req, res) => {
  const { userId } = req.session;
  const userSettings = await UserSettings.findOne({
    where: {
      UserUserId: userId
    }
  });
  console.log("Got user settings: ")
  console.log(userSettings)
  if (userSettings) {
    console.log("Config is")
    console.log(userSettings.config)
    if (!userSettings.config || userSettings.config == {} || !userSettings.config.headingFontFamily) {
      console.log("Setting new config: ")
      console.log(defaultUserSettings);
      userSettings.config = defaultUserSettings;
      await userSettings.save();
    }
    return res.json(userSettings.config)
  } else {
    const newSettings = await UserSettings.create({
      config: defaultUserSettings,
      UserUserId: userId
    })
    return res.json(defaultUserSettings)
  }
});

usersRouter.patch("/settings", validateUserCredentials, async (req, res) => {
  const { userId } = req.session;
  const newSettings = req.body;
  await UserSettings.update(
    {config: newSettings},
    {
      where: {
        UserUserId: userId
      }
    }
  )
  return res.json(newSettings)
})