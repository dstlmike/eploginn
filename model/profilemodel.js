const mongoose = require('mongoose');
const profileFindSchema = new mongoose.Schema({
  name: String,

  phone: String,
    address: String,

});
module.exports = mongoose.model('Profile', profileFindSchema);
