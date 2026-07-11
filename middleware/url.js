const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true ///,
   /// trim: true ,
    // Optional: Basic regex validation for URLs
   /// match: [
  ///    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, 
  ///    'Please fill a valid URL'
 ///   ]
  }
});

module.exports = mongoose.model('Website', websiteSchema);
