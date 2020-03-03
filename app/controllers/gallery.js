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
        console.log(err);
      }
    }
  },

  uploadFile: {
    handler: async function(request, h) {
      try {
        const islandID = request.params.islandID;
        const islandDetails = await Island.findById(islandID);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const result = await ImageStore.uploadImage(
            request.payload.imagefile
          );
          islandDetails.imageURL = result.secure_url;
          await islandDetails.save();
          console.log(`stalling.....${islandDetails}`);
          return h.redirect("/dashboard/showIslandDetails/" + islandID);
        }
        return h.redirect(
          // In the event the user selects 'upload' without uploading a file I redirect to the same page but pass an informational message in a query that is displayed in the view
          "/dashboard/showIslandDetails/" +
            islandID +
            "?noFile=No File Selected !"
        );
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true
    }
  },

  deleteImage: {
    handler: async function(request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);
        return h.redirect("/");
      } catch (err) {
        console.log(err);
      }
    }
  }
};

module.exports = Gallery;
