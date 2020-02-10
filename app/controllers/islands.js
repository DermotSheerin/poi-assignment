'use strict';
const Island = require('../models/island');

const Boom = require('@hapi/boom');

const Islands = {
    addIsland: {
        handler: async function(request, h) {
            try {
                const data = request.payload;
                const newIsland = new Island({
                    name: data.name,
                    category: data.category,
                    description: data.description
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
            const islands = await Island.find().lean(); // find and return all documents in a simple POJO array and populate the donor object
            return h.view('dashboard', {
               islands,
            });
        }
    },



};

module.exports = Islands;