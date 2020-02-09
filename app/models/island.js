'use strict';
const Boom = require('@hapi/boom');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const islandSchema = new Schema({
    name: String,
    category: String,
    description: String,
});

module.exports = Mongoose.model('Island', islandSchema);