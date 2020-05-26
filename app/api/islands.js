"use strict";

const Region = require("../models/region");
const Island = require("../models/island"); // THINK ABOUT MOVING THE findIslandsInRegion TO SOMEWHERE ELSE !!!
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const utils = require("./utils.js");

const Islands = {
  find: {
    auth: false,
    handler: async function(request, h) {
      const regionCategories = await Region.find();
      return regionCategories;
    }
  },

  categoryFilter: {
    // ALL REGIONS NOT IMPLEMENTED YET
    auth: false,
    handler: async function(request, h) {
      if (request.params.filter !== "All Regions") {
        const regionLean = await Region.findByRegionName(
          request.params.filter
        ).lean(); // find region object using region name above

        const regionId = regionLean._id; // retrieve region object reference ID
        const categoryFilter = await Island.findIslandsInRegion(
          regionId
          //userId
        )
          .populate("region")
          .populate("user")
          .lean(); // find all islands that have this region ID as a region object reference AND user ID as a user object reference then render to dashboard
        return categoryFilter;
      } else return "not implemented yet";
      // else {
      //   return await Region.find({})
      //     .region()
      //     .lean();
      // }
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
