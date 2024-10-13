// backend/models/Traffic.js
const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: true 
    },
    visits: {
         type: Number, 
         required: true 
        },
});

const Traffic = mongoose.model('Traffic', trafficSchema);
module.exports = Traffic;
