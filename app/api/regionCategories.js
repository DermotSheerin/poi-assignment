"use strict";

const Region = require("../models/region");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const utils = require("./utils.js");

const RegionCategories = {
  find: {
    auth: false,
    handler: async function(request, h) {
      const regionCategories = await Region.find();
      return regionCategories;
    }
  }
};

module.exports = RegionCategories;
