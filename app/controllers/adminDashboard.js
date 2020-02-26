const Boom = require("@hapi/boom");
const Island = require("../models/island");
const Region = require("../models/region");
const Joi = require("@hapi/joi");
const User = require("../models/user");

const AdminDashboard = {
  dashboard: {
    handler: async function(request, h) {
      const users = await User.find({ userRole: "member" }).lean();
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

  memberPOI: {
    handler: async function(request, h) {
      const userID = request.params.id;
      //const user = await User.findById(userID).lean();
      const userIslands = await Island.findIslandsByUserId(userID)
        .populate("user")
        .populate("region")
        .lean(); // if 'all Regions' is requested then retrieve all islands belonging to this user and render to view
      console.log(userIslands);
      return h.view("memberPOI", {
        userIslands: userIslands
      });
    }
  }
};

module.exports = AdminDashboard;
