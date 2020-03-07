"use strict";
const Boom = require("@hapi/boom");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const regionSchema = new Schema({
  region: String,
  adminOwner: Boolean
});

regionSchema.statics.findByRegionName = function(region) {
  // pass in region name and use this to find and return the region object
  return this.findOne({ region: region });
};

module.exports = Mongoose.model("Region", regionSchema);
