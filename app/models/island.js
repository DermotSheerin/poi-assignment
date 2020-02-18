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
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// islandSchema.statics.findById = function(id) {
//     return this.findOne({ region: 'id' });
// };

islandSchema.statics.findIslandsByUserId = function(userId) {
    return this.find({ user: userId})
};


islandSchema.statics.findUserIslandsInRegion = function(regionId, userId) {
    return this.find({ region: regionId, user: userId});
};



module.exports = Mongoose.model('Island', islandSchema);