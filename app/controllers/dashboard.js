const Boom = require("@hapi/boom");
const Island = require("../models/island");
const Region = require("../models/region");
const RegionUtil = require("../utils/region-util");

const Dashboard = {
  dashboard: {
    handler: async function(request, h) {
      const userId = request.auth.credentials.id;
      const regions = await Region.find({}).lean();

      return h.view("dashboard", {
        title: "POI Dashboard",
        userId: userId,
        regions: regions
      });
    }
  }
};

module.exports = Dashboard;
