/*
    Users tables model setup for mongodb
    Use a mongoose package to ensure a user can sign up only once and no duplicate 
    user in our DB
*/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);