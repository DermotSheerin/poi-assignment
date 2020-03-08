const Island = require("../models/island");
const Region = require("../models/region");
const Joi = require("@hapi/joi");
const User = require("../models/user");
const ImageStore = require("../utils/image-store");

const AdminDashboard = {
  dashboard: {
    handler: async function(request, h) {
      try {
        const users = await User.find({ userRole: "member" }).lean();
        const regions = await Region.find({}).lean();
        return h.view("adminDashboard", {
          title: "POI Dashboard - ADMIN",
          users: users,
          regions: regions
        });
      } catch (err) {
        return h.view("adminDashboard", { errors: [{ message: err.message }] });
      }
      // Unused code, keeping in case required in future
      // users.forEach(countUserIslands); // iterate through the users array and call countUserIslands function for each user
      // async function countUserIslands(user) {
      //   // pass the user to the Island model to count the number of Islands created by that user
      //   user.islandCount = await Island.countUserIslands(user._id);
      // }
    }
  },

  addRegion: {
    validate: {
      //  Hapi scoped module for validation
      payload: {
        region: Joi.string()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view("adminDashboard", {
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const region = request.payload.region;
        const newRegion = new Region({
          region: region
        });
        await newRegion.save();
        return h.redirect("/adminDashboard");
      } catch (err) {
        return h.view("adminDashboard", {
          errors: [{ message: err.message }]
        });
      }
    }
  },

  deleteRegion: {
    handler: async function(request, h) {
      try {
        const regionID = request.params.id;
        await Region.findByIdAndDelete(regionID);
        return h.redirect("/adminDashboard");
      } catch (err) {
        return h.view("adminDashboard", { errors: [{ message: err.message }] });
      }
    }
  },

  deleteMember: {
    handler: async function(request, h) {
      try {
        const userID = request.params.id;
        const userIslands = await Island.findIslandsByUserId(userID).lean();
        await ImageStore.deleteUserIslandImages(userIslands); // delete users Island images from cloudinary before deleting the island and then deleting the user
        await Island.deleteIslandsByUserId(userID); // prior to deleting member, delete all islands associate with the member
        await User.findByIdAndDelete(userID);
        return h.redirect("/adminDashboard");
      } catch (err) {
        return h.view("adminDashboard", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = AdminDashboard;
