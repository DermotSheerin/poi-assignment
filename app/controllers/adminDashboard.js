const Boom = require("@hapi/boom");
const Island = require("../models/island");
const Region = require("../models/region");
const Joi = require("@hapi/joi");
const User = require("../models/user");

const AdminDashboard = {
  dashboard: {
    handler: async function(request, h) {
      const users = await User.find({ userRole: "member" }).lean();

      users.forEach(countUserIslands); // iterate through the users array and call countUserIslands function for each user
      async function countUserIslands(user) {
        // pass the user to the Island model to count the number of Islands created by that user
        user.islandCount = await Island.countUserIslands(user._id);
      }

      return h.view("adminDashboard", {
        title: "POI Dashboard - ADMIN",
        users: users
      });
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

  deleteMember: {
    handler: async function(request, h) {
      const userID = request.params.id;
      const deleteIslands = await Island.deleteIslandsByUserId(userID); // prior to deleting member, delete all islands associate with the member
      const deleteMember = await User.findByIdAndDelete(userID);
      return h.redirect("/adminDashboard/");
    }
  }
};

module.exports = AdminDashboard;