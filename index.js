const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");

// Controllers
const userController = require("./controllers/user");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); // logger
app.use(passport.initialize()); // init passport

const strategy = require("./passport").passportStrategy;
strategy(passport); // use the passport strategy we defined

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true }
);

app.use('/user', userController);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
