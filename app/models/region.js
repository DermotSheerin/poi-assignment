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

// regionSchema.statics.findUserIslandsInRegion = function(regionId, userId) {
//   return this.find({ region: regionId, user: userId });
// };

module.exports = Mongoose.model("Region", regionSchema);
