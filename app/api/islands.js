"use strict";

const Region = require("../models/region");
const Island = require("../models/island"); // THINK ABOUT MOVING THE findIslandsInRegion TO SOMEWHERE ELSE !!!
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const utils = require("./utils.js");
const ImageStore = require("../utils/image-store");

const Islands = {
  find: {
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      const islands = await Island.find();
      return islands;
    }
  },

  addIsland: {
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      try {
        const userId = utils.getUserIdFromRequest(request); // retrieve the userId from request
        const data = request.payload;
        const newIsland = new Island({
          name: data.name,
          description: data.description,
          latitude: data.location.lat,
          longitude: data.location.lng,
          region: data.region._id,
          user: userId
        });
        const response = await newIsland.save();

        return h.response(response).code(201);
      } catch (err) {
        return err.message;
      }
    }
  },

  getUserIslands: {
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      try {
        const userId = request.params.userId;
        const userIslands = await Island.findIslandsByUserId(userId)
          .populate("user")
          .populate("region")
          .lean(); // Retrieve all islands belonging to this user
        console.log("here is one island backend: " + userIslands);
        return userIslands;
      } catch (err) {
        return err.message;
      }
    }
  },

  categoryFilter: {
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      try {
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
      } catch (err) {
        return err.message;
      }
    }
  },

  showIslandDetails: {
    auth: {
      strategy: "jwt"
    },
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
    auth: {
      strategy: "jwt"
    },
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

  addImage: {
    auth: false,
    handler: async function(request, h) {
      try {
        const imageURL = request.payload.image.url;
        const imageId = request.payload.image.public_id;
        const islandId = request.payload.islandId;
        const islandDetails = await Island.findById(islandId);
        islandDetails.imageURL.push([imageURL, imageId]);
        await islandDetails.save();
        return islandDetails;
      } catch (err) {
        return err.message;
      }
    }
  },

  deleteImage: {
    auth: false,
    handler: async function(request, h) {
      try {
        const imageId = request.payload.imageId;
        const islandId = request.payload.islandId;
        await ImageStore.deleteImage(imageId); // delete image from Cloudinary
        console.log(imageId + islandId);
        const updateIsland = await Island.findByIdAndUpdate(
          // find the Island and pull the array that contains the imageID
          { _id: islandId },
          { $pull: { imageURL: { $in: [imageId] } } },
          { safe: true },
          function(err) {
            if (err) {
              console.log(err);
            }
          }
        );
        await updateIsland.save();
        const island = await Island.findById(islandId); // when i tried to return the updateIsland object it did not contain the latest imageURL list which resulted
        // in the image not clearing on FE (it would take 2 attempts). However I could verify the object was deleted in mongoDB correctly. To resolve I retrieve the island details
        // again and return those
        return await island;
      } catch (err) {}
    }
  },

  deleteOne: {
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      try {
        const islandId = request.params.id;
        const islandDetails = await Island.findById(islandId).lean();

        if (islandDetails.imageURL.length) {
          // if the island contains images
          islandDetails.imageURL.forEach(deleteImageURL); // for each Image array in the island, call the deleteImageURL function and pass the image ID to the deleteImage function to be deleted on Cloudinary
          async function deleteImageURL(imageURL) {
            await ImageStore.deleteImage(imageURL[1]);
          }
        }
        const response = await Island.deleteOne({ _id: request.params.id });
        if (response.deletedCount == 1) {
          return { success: true };
        }
        return Boom.notFound("id not found");
      } catch (err) {
        return err.message;
      }
    }
  },

  deleteAll: {
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      try {
        const response = await Island.remove({});
        return { success: true };
      } catch (err) {
        return err.message;
      }
    }
  }
};

module.exports = Islands;
