'use strict';
const Island = require('../models/island');
const Region = require('../models/region');

const Boom = require('@hapi/boom');

const Islands = {
    addIsland: {
        handler: async function(request, h) {
            try {
                const data = request.payload;
                const userRegion = data.region;
                const regionLean = await Region.findByRegionName(userRegion).lean();
                console.log(regionLean._id);
                const newIsland = new Island({
                    name: data.name,
                    description: data.description,
                    region: regionLean._id
                });
                await newIsland.save();
                return h.redirect('/dashboard/listIslands');
            } catch (err) {
                return h.view('dashboard', { errors: [{ message: err.message }] });
            }
        }
},
    listIslands: {
        handler: async function(request, h) {
            const islands = await Island.find().populate('region').lean(); // find and return all islands in a simple POJO array and populate the region object
            return h.view('dashboard', {
               islands,
            });
        }
    },

    retrieveIslands: {
        handler: async function(request, h) {
            const region = request.query['region']; // retrieve the query passed from the regionCategories partial e.g., "href="/dashboard/getIslands?region=North East"" The URL ends at ? and query starts after ?
            let islandsInRegion;
            if (region != "allRegions") {
                const regionLean = await Region.findByRegionName(region); // find region object using region name above
                const regionId = regionLean._id; // retrieve region object reference ID
                islandsInRegion = await Island.findIslandsInRegion(regionId); // find all islands that have this region ID as a region object reference then render to dashboard
            }
            else islandsInRegion = await Island.find().populate('region').lean(); // if all Regions is requested then retrieve all islands and render to view
            return h.view('dashboard', {
                islandsInRegion
            });
        }
    },

            //
            // if (this.region = "allRegions")
            //     islandsInRegion = await Island.find().populate('region').lean();
            // else islandsInRegion = await Island.findIslandsInRegion(regionId); // find all islands that have this region ID as a region object reference then render to dashboard
            // //const islandsInRegion = await Island.findIslandsInRegion(regionId); // find all islands that have this region ID as a region object reference then render to dashboard


    addRegion: {
        handler: async function(request, h) {
            try {
                const region = request.payload.region;
                const newRegion = new Region({
                    region: region
                });
                await newRegion.save();
                return h.redirect('/dashboard/listIslands');
            } catch (err) {
                return h.view('dashboard', { errors: [{ message: err.message }] });
            }
        }
    },







};

module.exports = Islands;