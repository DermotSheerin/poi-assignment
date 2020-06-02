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
          region: data.region._id,
          user: userId
        });
        const response = await newIsland.save();

        console.log(response);

        return h.response(response).code(201);
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
  },

  showIslandDetails: {
    auth: false,
    handler: async function(request, h) {
      try {
        const islandId = request.params.id;
        const islandDetails = await Island.findById(islandId)
          .populate("region")
          .populate("user")
          .lean();
        return { islandDetails: islandDetails };
      } catch (err) {
        return err;
      }
    }
  },

  editIslandDetails: {
    auth: false,
    handler: async function(request, h) {
      try {
        const updateIsland = request.payload;
        const newRegionName = updateIsland.region;
        const newRegionObject = await Region.findByRegionName(
          newRegionName
        ).lean(); // retrieve region object using region name
        const islandId = updateIsland.islandId;
        const islandDetails = await Island.findById(islandId) // not using lean here as you need the full object in order to do an update and save
          .populate("region")
          .populate("user");
        islandDetails.region = newRegionObject; // set the new region
        islandDetails.name = updateIsland.name; // update island name
        islandDetails.description = updateIsland.description; // update island description
        islandDetails.longitude = updateIsland.longitude;
        islandDetails.latitude = updateIsland.latitude;
        await islandDetails.save();
        return h.response(islandDetails).code(200);
      } catch (err) {
        return err.message;
      }
    }
  },

  deleteOne: {
    auth: false,
    handler: async function(request, h) {
      const response = await Island.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    }
  }
};

module.exports = Islands;
