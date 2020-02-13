'use strict';
const Boom = require('@hapi/boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const islandSchema = new Schema({
    name: String,
    description: String,
    region: {
        type: Schema.Types.ObjectId,
        ref: 'Region'
    }
});

islandSchema.statics.findById = function(id) {
    return this.findOne({ region: 'id' });
};

// pass in the region object reference ID and find all islands that have this region ID as a region object reference (http://thecodebarbarian.com/how-find-works-in-mongoose.html)
islandSchema.statics.findIslandsInRegion = function(regionId) {
    return this.find({ region: regionId}).populate('region').lean();
};


module.exports = Mongoose.model('Island', islandSchema);