"use strict";
const Region = require("../models/region");
const Island = require("../models/island"); // THINK ABOUT MOVING THE findIslandsInRegion TO SOMEWHERE ELSE !!!
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const utils = require("./utils.js");

const Regions = {
  find: {
    auth: false, // temporarily leaving this authentication open as it is currently accessed before user login
    handler: async function(request, h) {
      const regions = await Region.find().lean();
      return regions;
    }
  }
};

module.exports = Regions;
