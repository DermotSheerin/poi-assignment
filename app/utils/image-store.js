"use strict";

const cloudinary = require("cloudinary");
const fs = require("fs"); // The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
  configure: function() {
    const credentials = {
      cloud_name: process.env.name,
      api_key: process.env.key,
      api_secret: process.env.secret
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
      // each island that contains an image, pass the ID of the image to the deleteImage function to delete on cloudinary
      if (island.imageURL.length) {
        await ImageStore.deleteImage(island.imageURL[1]); // pass in the image ID to the deleteImage function
      }
    }
  }
};

module.exports = ImageStore;
