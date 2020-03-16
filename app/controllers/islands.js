"use strict";
const Island = require("../models/island");
const Region = require("../models/region");
const User = require("../models/user");
const Joi = require("@hapi/joi");
const ImageStore = require("../utils/image-store");

const Islands = {
  addIsland: {
    validate: {
      //  Hapi scoped module for validation
      payload: {
        region: Joi.string(),
        name: Joi.string().required(),
        description: Joi.string(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      },
      options: {
        abortEarly: false
      },
      failAction: async function(request, h, error) {
        return h
          .view("dashboard", {
            errors: error.details,
            island: request.payload // pass the details entered by the user into the view to avoid user having to re-enter fields
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
          latitude: data.latitude,
          longitude: data.longitude,
          region: regionLean._id,
          user: userId
        });
        await newIsland.save();

        const user = await User.findByIdAndUpdate(userId, {
          // find the User by ID and increment the islandCount by 1
          $inc: { islandCount: 1 }
        });
        await user.save();

        return h.redirect("/dashboard/listIslands"); // display full list of islands for user once they add a new island
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  },

  listIslands: {
    handler: async function(request, h) {
      try {
        const userId = request.auth.credentials.id;
        const user = await User.findById(userId).lean();
        const regions = await Region.find({}).lean(); // adding all region details into the view to enable the drop down menu to display all Region Categories in the DB

        const userIslands = await Island.findIslandsByUserId(userId)
          .populate("user")
          .populate("region")
          .lean(); // Retrieve all islands belonging to this user and render to view
        return h.view("dashboard", {
          userIslands,
          user,
          regions
        });
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  },

  deleteUserIsland: {
    handler: async function(request, h) {
      try {
        const loggedInUserId = request.auth.credentials.id;
        const loggedInUser = await User.findById(loggedInUserId).lean();
        const islandId = request.params.id;
        const userID = request.params.userID;
        const islandDetails = await Island.findById(islandId).lean();

        if (islandDetails.imageURL.length) {
          // if the island contains images
          islandDetails.imageURL.forEach(deleteImageURL); // for each Image array in the island, call the deleteImageURL function and pass the image ID to the deleteImage function to be deleted on Cloudinary
          async function deleteImageURL(imageURL) {
            await ImageStore.deleteImage(imageURL[1]);
          }
        }
        await Island.findByIdAndRemove(islandId); // delete island

        // depending on whether the admin or member calls this handler, perform the following
        if (loggedInUser.userRole === "admin") {
          const user = await User.findByIdAndUpdate(userID, {
            // find the User by ID and decrement the islandCount by 1
            $inc: { islandCount: -1 }
          });
          await user.save();
          return h.redirect("/adminDashboard/" + userID);
        } else {
          const user = await User.findByIdAndUpdate(loggedInUserId, {
            // find the User by ID and decrement the islandCount by 1
            $inc: { islandCount: -1 }
          });
          await user.save();
          return h.redirect("/dashboard/listIslands");
        }
      } catch (err) {
        if (loggedInUser.userRole === "admin") {
          return h.view("adminDashboard", {
            errors: [{ message: err.message }]
          });
        } else {
          return h.view("dashboard", { errors: [{ message: err.message }] });
        }
      }
    }
  },

  retrieveUserIslands: {
    handler: async function(request, h) {
      try {
        const region = request.query["region"]; // retrieve the query passed from the regionCategories partial e.g., "href="/dashboard/getIslands?region=North East"" The URL ends at ? and query starts after ?
        const userId = request.auth.credentials.id;
        const user = await User.findById(userId).lean();
        const regions = await Region.find({}).lean(); // adding all region details into the view to enable the drop down menu to display all Region Categories in the DB

        let userIslandsInRegion;
        if (region !== "All Regions") {
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
            .lean(); // if 'All Regions' is requested then retrieve all islands belonging to this user and render to view
        return h.view("dashboard", {
          userIslands: userIslandsInRegion,
          userId: userId,
          user: user,
          regions: regions
        });
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  },

  showMembersIslands: {
    // retrieve member islands for the admin view
    handler: async function(request, h) {
      try {
        const userID = request.params.id;
        const userIslands = await Island.findIslandsByUserId(userID)
          .populate("user")
          .populate("region")
          .lean();
        return h.view("adminListIslands", {
          userIslands: userIslands,
          userID: userID
        });
      } catch (err) {
        return h.view("adminListIslands", {
          errors: [{ message: err.message }]
        });
      }
    }
  },

  showIslandDetails: {
    handler: async function(request, h) {
      try {
        const islandId = request.params.id;
        const regions = await Region.find({}).lean();
        const islandDetails = await Island.findById(islandId)
          .populate("region")
          .populate("user")
          .lean();
        return h.view("memberEditIslandDetails", {
          islandDetails: islandDetails,
          regions: regions
        });
      } catch (err) {
        return h.view("memberEditIslandDetails", {
          errors: [{ message: err.message }]
        });
      }
    }
  },

  editIslandDetails: {
    handler: async function(request, h) {
      try {
        const updateIsland = request.payload;
        const newRegionName = updateIsland.region;
        const newRegionObject = await Region.findByRegionName(newRegionName); // retrieve region object using region name
        const islandId = request.params.id;
        const islandDetails = await Island.findById(islandId).populate(
          // retrieve island object using the island ID
          "region"
        );
        islandDetails.region = newRegionObject; // set the new region
        islandDetails.name = updateIsland.name; // update island name
        islandDetails.description = updateIsland.description; // update island description
        await islandDetails.save();
        return h.redirect("/dashboard/listIslands");
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Islands;
