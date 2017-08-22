const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); //stores session data into the cookie; no need to install outside server to store a reference to the session like express-session
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

/*
interacts with mongoDB;
this will help create collections in MongoDB
by using model classes
*/

mongoose.connect(keys.MONGO_URI);

const app = express();

/*
Middlewares are small func that can be used to modifiy incoming requests to our app before they're sent off to route handlers
*/

app.use(bodyParser.json());

app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, // how long it can exist in browser (30 Days in this case)
		keys: [keys.COOKIE_KEY] // allows us to pass keys that can encrypt any cookie
	})
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	// catch all case
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

/* dynamically decide which port to listen on.
whenever heroku runs our app, it can inject environment variables. it will decide which port we'll use in production, otherwise use 5000 in dev. */

const PORT = process.env.PORT || 5000;
app.listen(PORT);
