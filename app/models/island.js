'use strict';
const Boom = require('@hapi/boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const islandSchema = new Schema({
    name: String,
    category: String,
    description: String,
    region: {
        type: Schema.Types.ObjectId,
        ref: 'Region'
    }
});

islandSchema.statics.findById = function(id) {
    return this.findOne({ region: 'id' });
};


// islandSchema.statics.findByCategory = function(category) {
//     return this.where({ category: category});
// };
//
//


module.exports = Mongoose.model('Island', islandSchema);