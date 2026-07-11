
const mongoose = require('mongoose');
const timesheetSchema = new mongoose.Schema({
  weekstart: String,
 weekending: String,
  monday: String,

  tuesday: String,
    wednesday: String,
thursday: String,
  friday: String,
  saturday: String,
  Sunday: String,
    img: {
        data: Buffer,
        contentType: String,
        description: String
    }
});
module.exports = mongoose.model('Timesheet', timesheetSchema);
