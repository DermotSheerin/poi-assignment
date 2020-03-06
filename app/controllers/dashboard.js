const Boom = require("@hapi/boom");
const Island = require("../models/island");
const Region = require("../models/region");
const RegionUtil = require("../utils/region-util");

const Dashboard = {
  dashboard: {
    handler: async function(request, h) {
      const userId = request.auth.credentials.id;
      const regions = await Region.find({}).lean();
      console.log(`here we are again .....${regions}`);
      // // const returnAllRegionsArray = await RegionUtil.returnAllRegionsArray(
      //    regions
      //  );
      //console.log(`here are the regions Array: ${returnAllRegionsArray}`);
      //const user = await User.findById(userId);
      // const userIslandsInRegion = await Island.findIslandsByUserId(userId)
      //   .populate("user")
      //   .populate("region")
      //   .lean(); // Retrieve all islands belonging to this user and render to view

      return h.view("dashboard", {
        title: "POI Dashboard",
        userId: userId,
        regions: regions
      });
    }
  }
};

module.exports = Dashboard;
