var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema = new Schema({
  pseudo: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  encPassword: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);