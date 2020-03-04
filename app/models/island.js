"use strict";
const Boom = require("@hapi/boom");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const islandSchema = new Schema({
  name: String,
  description: String,
  imageURL: Array,
  region: {
    type: Schema.Types.ObjectId,
    ref: "Region"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

islandSchema.statics.findIslandsByUserId = function(userId) {
  return this.find({ user: userId }).sort({ region: 1 }); // return islands sorted by region
};

islandSchema.statics.findUserIslandsInRegion = function(regionId, userId) {
  return this.find({ region: regionId, user: userId });
};

islandSchema.statics.deleteIslandsByUserId = function(userId) {
  return this.find({ user: userId }).deleteMany(); // deletes every island document that matches the filter i.e., the userId passed in, in the collection
};

// method no longer needed
// islandSchema.statics.deleteOneUserIsland = function(userId, islandID) {
//   return this.find({ user: userId }).deleteOne({ _id: islandID }); // deletes a single island document that belongs to a specific user
// };

islandSchema.statics.countUserIslands = function(userId) {
  return this.find({ user: userId }).countDocuments(); // return a count of the islands belonging to a particular user
};

module.exports = Mongoose.model("Island", islandSchema);
