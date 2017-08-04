const express = require("express");
const app = express();

app.get(
  "/",
  (responseHandler = (req, res) => {
    res.send({ hi: "there" });
  })
);

// dynamically decide which port to listen on
// w/e heroku runs our app, it can inject environment variables.
// it will decide which port we'll use in production, otherwise use 5000 in dev.

const PORT = process.env.PORT || 5000;
app.listen(PORT);
