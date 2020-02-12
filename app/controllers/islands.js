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
            const islands = await Island.find().populate('region').lean(); // find and return all documents in a simple POJO array and populate the donor object
            //console.log(`here are islands: ${islands}`)
            console.log(islands)
            return h.view('dashboard', {
               islands,
            });
        }
    },

    // retrieveRegion: {
    //     handler: async function(request, h) {
    //         const path = request.path;
    //         const query = new URLSearchParams(path);
    //         const result = query.get('region');
    //         console.log(result);
    //         const islands = await Island.find().lean(); // find and return all documents in a simple POJO array and populate the donor object
    //
    //         return h.view('dashboard', {
    //
    //         });
    //     }
    // },

    retrieveRegion: {
        handler: async function(request, h) {
            const region = request.query['region'];
            const regionLean = await Region.findByRegionName(region).lean();
            const regionId = regionLean._id;
            //const islandsInRegion = Island.findById(regionId).populate().lean();
            const islandsInRegion = Region.findAllInRegion(regionId).populate().lean();



            console.log(`these are islands in region ${islandsInRegion}`);

            return h.view('dashboard', {

            });
        }
    },

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