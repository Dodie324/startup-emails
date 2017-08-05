const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

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
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      const { id } = profile;
      User.findOne({ googleId: id }).then(existingUser => {
        if (existingUser) {
          // null means there is no error
          done(null, existingUser);
        } else {
          // create new record and save to DB
          new User({ googleId: id }).save().then(user => done(null, user));
        }
      });
    }
  )
);
