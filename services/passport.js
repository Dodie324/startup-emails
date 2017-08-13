const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

// these encode the user id into session cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const existingUser = await User.findOne({ googleId });

      if (existingUser) {
        // null means there is no error
        return done(null, existingUser);
      }

      // create new record and save to DB
      const user = await new User({ googleId }).save();
      done(null, user);
    }
  )
);
