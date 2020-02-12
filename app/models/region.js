'use strict';
const Boom = require('@hapi/boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const regionSchema = new Schema({
    region: String
});

regionSchema.statics.findByRegionName = function(region) {
    return this.findOne({ region: region });
};

regionSchema.statics.findAllInRegion = function(regionId) {
    return this.get(regionId);
};

module.exports = Mongoose.model('Region', regionSchema);