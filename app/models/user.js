"use strict";
const Boom = require("@hapi/boom");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  userRole: String,
  islandCount: { type: Number, default: 0 }
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email });
};

userSchema.methods.comparePassword = function(candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw Boom.unauthorized("Password mismatch"); // Notice that if there is no match, we throw an exception as opposed to returning true/false. Also, we are returning the user object.
  }
  return this;
};

module.exports = Mongoose.model("User", userSchema);
