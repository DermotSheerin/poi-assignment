"use strict";

const Region = require("../models/region");
const Island = require("../models/island"); // THINK ABOUT MOVING THE findIslandsInRegion TO SOMEWHERE ELSE !!!
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const utils = require("./utils.js");

const Islands = {
  addIsland: {
    auth: false,
    // validate: {
    //   //  Hapi scoped module for validation
    //   payload: {
    //     region: Joi.string(),
    //     name: Joi.string().required(),
    //     description: Joi.string(),
    //     latitude: Joi.number().required(),
    //     longitude: Joi.number().required()
    //   },
    //   options: {
    //     abortEarly: false
    //   },
    //   failAction: async function(request, h, error) {
    //     return h
    //         .view("dashboard", {
    //           errors: error.details,
    //           island: request.payload // pass the details entered by the user into the view to avoid user having to re-enter fields
    //         })
    //         .takeover()
    //         .code(400);
    //   }
    // },
    handler: async function(request, h) {
      try {
        const userId = utils.getUserIdFromRequest(request); // retrieve the userId from request
        const data = request.payload;
        const newIsland = new Island({
          name: data.name,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          region: data.regionCategory,
          user: userId
        });
        await newIsland.save();

        // const user = await User.findByIdAndUpdate(userId, {
        //   // find the User by ID and increment the islandCount by 1
        //   $inc: { islandCount: 1 }
        // });
        // await user.save();

        return h.response(newIsland).code(201);
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  },

  getUserIslands: {
    auth: false,
    handler: async function(request, h) {
      const userId = request.params.userId;
      const userIslands = await Island.findIslandsByUserId(userId)
        .populate("user")
        .populate("region")
        .lean(); // Retrieve all islands belonging to this user
      console.log("here is one island backend: " + userIslands);
      return userIslands;
    }
  },

  categoryFilter: {
    // ALL REGIONS NOT IMPLEMENTED YET
    auth: false,
    handler: async function(request, h) {
      const userId = utils.getUserIdFromRequest(request); // retrieve the userId from request
      if (request.params.filter !== "All Regions") {
        const regionLean = await Region.findByRegionName(
          request.params.filter
        ).lean(); // find region object using region name above

        const regionId = regionLean._id; // retrieve region object reference ID
        const categoryFilter = await Island.findUserIslandsInRegion(
          // retrieve the user islands in this region
          regionId,
          userId
        )
          .populate("region")
          .populate("user")
          .lean(); // find all islands that have this region ID as a region object reference AND user ID as a user object reference then render to dashboard
        return categoryFilter;
      } else
        return await Island.findIslandsByUserId(userId)
          .populate("user")
          .populate("region")
          .lean(); // if 'All Regions' is requested then retrieve all islands belonging to this user and render to view
    }
  }
};

//   categoryFilter: {
//     auth: false,
//     handler: async function(request, h) {
//       const regionLean = await Region.findByRegionName(
//           request.params.filter
//       ).lean(); // find region object using region name above
//
//       if (request.params.filter !== "All Regions") {
//         const regionId = regionLean._id; // retrieve region object reference ID
//         const categoryFilter = await Island.findIslandsInRegion(
//             regionId
//             //userId
//         )
//             .populate("region")
//             .populate("user")
//             .lean(); // find all islands that have this region ID as a region object reference AND user ID as a user object reference then render to dashboard
//         // },
//         // const categoryFilter = await Island.findIslandsInRegion(
//         //   request.params.filter
//         // );
//         console.log(categoryFilter);
//         return categoryFilter;
//       } else {
//         return await Region.find({})
//             .region()
//             .lean();
//       }
//     }
//   }
// }

module.exports = Islands;
