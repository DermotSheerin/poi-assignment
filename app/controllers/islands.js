"use strict";
const Island = require("../models/island");
const Region = require("../models/region");
const User = require("../models/user");
const Joi = require("@hapi/joi");
const ImageStore = require("../utils/image-store");

const Boom = require("@hapi/boom");

const Islands = {
  addIsland: {
    validate: {
      //  Hapi scoped module for validation
      payload: {
        region: Joi.string(),
        name: Joi.string().required(),
        description: Joi.string().required(),
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
        //const user = await User.findById(userId);
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
        errors: [{ message: err.message }];
      }
    }
  },

  listIslands: {
    handler: async function(request, h) {
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
    }
  },

  deleteUserIsland: {
    handler: async function(request, h) {
      const loggedInUserId = request.auth.credentials.id;
      const loggedInUser = await User.findById(loggedInUserId).lean();
      const islandId = request.params.id;
      const userID = request.params.userID;
      const islandDetails = await Island.findById(islandId).lean();
      await ImageStore.deleteImage(islandDetails.imageURL[1]); // delete image from Cloudinary
      console.log("any joy here " + islandDetails);
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
    }
  },

  retrieveUserIslands: {
    handler: async function(request, h) {
      try {
        const region = request.query["region"]; // retrieve the query passed from the regionCategories partial e.g., "href="/dashboard/getIslands?region=North East"" The URL ends at ? and query starts after ?
        const userId = request.auth.credentials.id;
        const regions = await Region.find({}).lean(); // adding all region details into the view to enable the drop down menu to display all Region Categories in the DB

        let userIslandsInRegion;
        if (region !== "allRegions") {
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
          userIslands: userIslandsInRegion,
          userId: userId,
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
      const userID = request.params.id;
      const userIslands = await Island.findIslandsByUserId(userID)
        .populate("user")
        .populate("region")
        .lean(); // if 'all Regions' is requested then retrieve all islands belonging to this user and render to view
      return h.view("adminListIslands", {
        userIslands: userIslands,
        userID: userID
      });
    }
  },

  showIslandDetails: {
    handler: async function(request, h) {
      const islandId = request.params.id;
      const noFile = request.query["noFile"]; // In the event the user selects 'upload' when uploading an image (without uploading a file) I redirect to the same page but pass an informational message in a query that is displayed in the view ie., 'No File to Upload
      const islandDetails = await Island.findById(islandId)
        .populate("region")
        .populate("user")
        .lean();
      return h.view("memberEditIslandDetails", {
        islandDetails: islandDetails,
        noFile: noFile // Passing error message when no file is selected - future release will possibly implement a JQuery action to hide the upload button until a file as been uploaded
      });
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
        console.log(`here are islands details BEFORE change ${islandDetails}`);
        islandDetails.region = newRegionObject; // set the new region
        islandDetails.name = updateIsland.name; // upd  ate island name
        islandDetails.description = updateIsland.description; // update island description
        await islandDetails.save();
        console.log(`here are islands details AFTER save ${islandDetails}`);
        return h.redirect("/dashboard/listIslands");
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Islands;
