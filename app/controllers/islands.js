"use strict";
const Island = require("../models/island");
const Region = require("../models/region");
const User = require("../models/user");
const Joi = require("@hapi/joi");

const Boom = require("@hapi/boom");

const Islands = {
  addIsland: {
    validate: {
      //  Hapi scoped module for validation
      payload: {
        region: Joi.string(),
        name: Joi.string().required(),
        description: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view("dashboard", {
            errors: error.details,
            island: request.payload // pass the details entered by the user into the login view to avoid user having to re-enter fields
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const userId = request.auth.credentials.id;
        const data = request.payload;
        const userRegion = data.region;
        const regionLean = await Region.findByRegionName(userRegion).lean();
        const newIsland = new Island({
          name: data.name,
          description: data.description,
          region: regionLean._id,
          user: userId
        });
        await newIsland.save();
        return h.redirect("/dashboard");
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  },
  // listIslands: {
  //     handler: async function(request, h) {
  //         const id = request.auth.credentials.id;
  //         const user = await User.findById(id).lean();
  //         const islands = await Island.find().populate('region').lean(); // find and return all islands in a simple POJO array and populate the region object
  //         console.log(islands)
  //         return h.view('dashboard', {
  //            islands, user
  //         });
  //     }
  // },

  retrieveUserIslands: {
    handler: async function(request, h) {
      try {
        const region = request.query["region"]; // retrieve the query passed from the regionCategories partial e.g., "href="/dashboard/getIslands?region=North East"" The URL ends at ? and query starts after ?
        const userId = request.auth.credentials.id;
        let userIslandsInRegion;
        if (region != "allRegions") {
          const regionLean = await Region.findByRegionName(region).lean(); // find region object using region name above
          const regionId = regionLean._id; // retrieve region object reference ID
          userIslandsInRegion = await Island.findUserIslandsInRegion(
            regionId,
            userId
          )
            .populate("region")
            .populate("user")
            .lean(); // find all islands that have this region ID as a region object reference AND user ID as a user object reference then render to dashboard
        } else
          userIslandsInRegion = await Island.findIslandsByUserId(userId)
            .populate("user")
            .populate("region")
            .lean(); // if 'all Regions' is requested then retrieve all islands belonging to this user and render to view
        return h.view("dashboard", {
          userIslands: userIslandsInRegion
        });
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  }

  // addRegion: {
  //   validate: {
  //     //  Hapi scoped module for validation
  //     payload: {
  //       region: Joi.string()
  //     },
  //     failAction: function(request, h, error) {
  //       return h
  //         .view("/adminDashboard", {
  //           errors: error.details
  //         })
  //         .takeover()
  //         .code(400);
  //     }
  //   },
  //   handler: async function(request, h) {
  //     try {
  //       const region = request.payload.region;
  //       const newRegion = new Region({
  //         region: region
  //       });
  //       await newRegion.save();
  //       return h.redirect("adminDashboard");
  //     } catch (err) {
  //       return h.view("adminDashboard", {
  //         errors: [{ message: err.message }]
  //       });
  //     }
  //   }
  // }
};

module.exports = Islands;
