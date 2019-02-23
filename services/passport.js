const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

/** 1.0 setup options for local Strategy */
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  /** check if the email exists in our database */
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err, false);
    }
    /** if it doesn't exist, call done without a user  */
    if (!user) {
      return done(null, false);
    }
    /** if it does exist, verify the password */
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err, false);
      }
      /** if password incorrect, call done without a user*/
      if (!isMatch) {
        return done(null, false);
      }
      /** if the password is correct, call done with the user */
      return done(null, user);
    });
  });
});

/****************** */

/** 2.0, setup options for JWT Strategy */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

/** 2.1, Create JWT Strategy */
/** JWT strategy here is used to authenticate get requests' token */
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  /**  see if the userID in the payload exists in our database */
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    /** if it does, call 'done' with that user */
    if (user) {
      done(null, user); //no error, takes that user(result from findById)
    } else {
      /** if it doesn't, call 'done' without a user object */
      done(null, false); //no error, no user
    }
  });
});

/** 1.2 tell passport to use local strategy */
passport.use(localLogin);
/** 2.2, tell passport to use jwt Strategy */
passport.use(jwtLogin);
