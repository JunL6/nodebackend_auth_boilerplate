const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

/** Define user model schema */
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

/** on Save hook, encrypt password */
userSchema.pre("save", function(next) {
  /** get access to user model */
  const user = this;
  /** generate a salt, then runs the callback */
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    /** use the salt to hash the password */
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      /** overwrite plain text password with hashed password */
      user.password = hash;
      next();
    });
  });
});

/** define a custom document instance method to compare password for sign-in  */
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

/** create the model class/ compiling our schema into a Model. */
const ModelClass = mongoose.model("user", userSchema);

/** export the model */
module.exports = ModelClass;
