const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: String,
  parents: [String],
  partner: String,
  children: [String],
  bio: String
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personSchema);