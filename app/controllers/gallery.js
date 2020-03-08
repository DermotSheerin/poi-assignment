"use strict";

const ImageStore = require("../utils/image-store");
const Island = require("../models/island");

const Gallery = {
  index: {
    handler: async function(request, h) {
      try {
        const allImages = await ImageStore.getAllImages();
        return h.view("memberEditIslandDetails", {
          title: "Cloudinary Gallery",
          images: allImages
        });
      } catch (err) {
        return h.view("memberEditIslandDetails", {
          errors: [{ message: err.message }]
        });
      }
    }
  },

  uploadFile: {
    handler: async function(request, h) {
      let islandLean;
      try {
        const islandID = request.params.islandID;
        const islandDetails = await Island.findById(islandID);
        islandLean = await Island.findById(islandID).lean();
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const result = await ImageStore.uploadImage(file);
          islandDetails.imageURL.push([result.secure_url, result.public_id]); // place the Image URL into index 0 of imageURL array in Island schema
          await islandDetails.save(); // Note using the above array provides a possible base for future development where I can upload multiple images per island
          return h.redirect("/dashboard/showIslandDetails/" + islandID);
        }
      } catch (err) {
        return h.view("memberEditIslandDetails", {
          errors: [{ message: err.message }]
        });
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true
    }
    // UNUSED CODE
    // const message =
    //   "No File Selected for Upload! Please choose a file to Upload before clicking 'Upload'";
    // throw Boom.badData(message);

    // Original code to handle user not selecting a file to upload
    // return h.redirect(
    //   // In the event the user selects 'upload' without uploading a file I redirect to the same page but pass an informational message in a query that is displayed in the view
    //   "/dashboard/showIslandDetails/" +
    //     islandID +
    //     "?noFile=No File Selected !" // In a later release I will attempt to implement JQuery to perform a similiar task, for now this will suffice and achieve what I need
    // );
  },

  deleteImage: {
    handler: async function(request, h) {
      try {
        const islandID = request.params.islID;
        const imageID = request.params.imageID;
        await ImageStore.deleteImage(imageID); // delete image from Cloudinary
        const island = await Island.findById(islandID);
        await Island.findByIdAndUpdate(
          // find the Island and pull the array that contains the imageID
          { _id: islandID },
          { $pull: { imageURL: { $in: [imageID] } } }
        );
        await island.save();
        return h.redirect("/dashboard/showIslandDetails/" + islandID);
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Gallery;
