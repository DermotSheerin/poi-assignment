"use strict";

const cloudinary = require("cloudinary");
const fs = require("fs"); // The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
  configure: function() {
    const credentials = {
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret
    };
    cloudinary.config(credentials);
  },

  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function(imagefile) {
    await writeFile("./public/images/temp.img", imagefile);
    return await cloudinary.uploader.upload("./public/images/temp.img"); // return response containing URL to access image
  },

  deleteImage: async function(id) {
    if (id) {
      // if the ID is valid, delete, otherwise do nothing
      await cloudinary.v2.uploader.destroy(id);
    }
  },

  deleteUserIslandImages: async function(userIslands) {
    userIslands.forEach(getImageURL); // pass in the users Islands into a forEach and call a function once for each island in the array
    async function getImageURL(island) {
      if (island.imageURL.length) {
        island.imageURL.forEach(deleteImageURL); // // for each Image array in the island, call the deleteImageURL function and pass the image ID to the deleteImage function to be deleted on Cloudinary
        async function deleteImageURL(imageURL) {
          await ImageStore.deleteImage(imageURL[1]);
        }
      }
    }
  }
};

module.exports = ImageStore;
