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
          const result = await ImageStore.uploadImage(file);
          islandDetails.imageURL.push(result.secure_url); // place the Image URL into index 0 of imageURL array in Island schema
          islandDetails.imageURL.push(result.public_id); // place the Image ID into index 1 of imageURL array in Island schema
          // islandDetails.imageURL.set(0, result.secure_url); // place the Image URL into index 0 of imageURL array in Island schema
          // islandDetails.imageURL.set(1, result.public_id); // place the Image ID into index 1 of imageURL array in Island schema
          await islandDetails.save();
          //console.log(`stalling.....${islandDetails}`);
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
        const islandID = request.params.islID;
        const imageID = request.params.imageID;
        await ImageStore.deleteImage(imageID);
        const island = await Island.findById(islandID);
        island.imageURL.splice(0, island.imageURL.length); // empty the image array in the island schema
        await island.save();
        console.log(`here is island obj after  clear array: ${island}`);
        return h.redirect("/dashboard/showIslandDetails/" + islandID);
      } catch (err) {
        console.log(err);
      }
    }
  }
};

module.exports = Gallery;
