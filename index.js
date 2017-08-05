const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const keys = require("./config/keys");

const app = express();

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {}
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get("/auth/google/callback", passport.authenticate("google"));

// dynamically decide which port to listen on
// w/e heroku runs our app, it can inject environment variables.
// it will decide which port we'll use in production, otherwise use 5000 in dev.

const PORT = process.env.PORT || 5000;
app.listen(PORT);
