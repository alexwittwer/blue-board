const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  name: String,
  comment: String,
  date: Date,
});

// Export model
module.exports = mongoose.model("Message", messageSchema);
