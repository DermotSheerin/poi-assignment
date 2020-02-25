const Boom = require("@hapi/boom");
const Island = require("./islands");
const Region = require("../models/region");
const Joi = require("@hapi/joi");

const AdminDashboard = {
  dashboard: {
    handler: function(request, h) {
      return h.view("adminDashboard", { title: "POI Dashboard - ADMIN" });
    }
  },

  addRegion: {
    validate: {
      //  Hapi scoped module for validation
      payload: {
        region: Joi.string()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view("adminDashboard", {
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const region = request.payload.region;
        const newRegion = new Region({
          region: region
        });
        await newRegion.save();
        return h.redirect("/adminDashboard");
      } catch (err) {
        return h.view("adminDashboard", {
          errors: [{ message: err.message }]
        });
      }
    }
  }
};

module.exports = AdminDashboard;
