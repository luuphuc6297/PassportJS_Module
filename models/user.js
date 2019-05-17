const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {type: String, trim: true, index: true, require: true},
    email: {type: String, trim: true,
        validate:{
            validator: validator.isEmail
        }},
    password: {type: String, trim: true , index: true},
    date: {type: Date,  default: Date.now}

});
module.exports = mongoose.model('User', userSchema);