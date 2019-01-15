const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  res.send(tokenForUser(req.user));
};

exports.signup = function(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email: email }, function(err, existingUser) {
    /** 0 if DB connection error */
    if (err) {
      return next(err);
    }

    /** 0.1 check if both email and password are provided */
    if (!email || !password) {
      return res
        .status(422)
        .send({ error: "You must provide email and password" });
    }

    /** 1, see if the email provided already exists */

    ///** 1.1 if it exists, return an error */
    if (existingUser) {
      return res.status(422).send({ error: "Email is already in use" });
    }

    /** 1.2 if it doesn't exist, create & save a user record */
    const user = new User({
      email,
      password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }
    });

    /** 2, respond to request indicating the user was created */
    res.json({ token: tokenForUser(user) });
  });
};
