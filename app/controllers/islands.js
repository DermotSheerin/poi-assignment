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
                return h.redirect('/dashboard');
            } catch (err) {
                return h.view('home', { errors: [{ message: err.message }] });
            }
        }
}



};

module.exports = Islands;