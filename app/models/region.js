'use strict';
const Boom = require('@hapi/boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const regionSchema = new Schema({
    region: String
});

regionSchema.statics.findByRegionName = function(region) { // pass in region name and use this to find and return the region object
    return this.findOne({ region: region }).lean();
};


module.exports = Mongoose.model('Region', regionSchema);