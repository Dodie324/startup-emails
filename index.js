const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

/*
interacts with mongoDB;
this will help create collections in MongoDB
by using model classes
*/
mongoose.connect(keys.MONGO_URI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // how long it can exist in browser (30 Days in this case)
    keys: [keys.COOKIE_KEY] // allows us to pass keys that can encrypt any cookie
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);

/* dynamically decide which port to listen on.
whenever heroku runs our app, it can inject environment variables. it will decide which port we'll use in production, otherwise use 5000 in dev. */

const PORT = process.env.PORT || 5000;
app.listen(PORT);
