
const mongoose = require('mongoose');
const imggSchema = new mongoose.Schema({
  name: String,

  phone: String,
    address: String,
  addresss: Array,
  today: {
imgg: {
    img: {
        data: Buffer,
        contentType: String,
        description: String
    },
  img1: {
        data: Buffer,
        contentType: String,
        description: String
  },
  img2: {
        data: Buffer,
        contentType: String,
        description: String
  },
  img3: {
        data: Buffer,
        contentType: String,
        description: String
  },
  img4: {
        data: Buffer,
        contentType: String,
        description: String
  },
  img5: {
        data: Buffer,
        contentType: String,
        description: String
  },
  img6: {
        data: Buffer,
        contentType: String,
        description: String
  },
  img7: {
        data: Buffer,
        contentType: String,
        description: String
  },
  img8: {
        data: Buffer,
        contentType: String,
        description: String
  },
  img9: {
        data: Buffer,
        contentType: String,
        description: String
  }
  }
  }
});
module.exports = mongoose.model('Image', imggSchema);
