const mongoose = require('mongoose');
const user2Schema = new mongoose.Schema({
email: String,
password: String
});
module.exports = mongoose.model('users', imggSchema);
