const router = require("express").Router();
const passport = require("passport");
const utils = require("../helpers/utils");

const User = require('../models/User');

router.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res
      .status(500)
      .send({ success: false, message: "Email and Password required." });
  } else {
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    user
      .save()
      .then(u => {
        const cleanedUser = {
          email: u.email
        };
        const token = utils.createSignedToken(cleanedUser);
        res.send({ success: true, token: token, message: "User created." });
      })
      .catch(err => {
        return res
          .status(500)
          .send({ success: false, message: "Email already exists.", err: err });
      });
  }
});

router.post("/authenticate", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      user.comparePassword(req.body.password, (err, matched) => {
        if (!err && matched) {
          const cleanedUser = {
            email: user.email
          };
          const token = utils.createSignedToken(cleanedUser);
          res.send({ success: true, token: token });
        } else {
          res
            .status(500)
            .send({ success: false, message: "Password did not match" });
        }
      });
    }
  });
});

router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({ id: req.user._id });
  }
);

module.exports = router;
