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

    // const result = await cloudinary.uploader.upload("./public/images/temp.img"); // i added const result and return
    // return result;
  },

  deleteImage: async function(id) {
    console.log(`here is image store ID: ${id}`);
    const story = await cloudinary.v2.uploader.destroy(id, function(
      error,
      result
    ) {});
    console.log(story);
  }
};

module.exports = ImageStore;
