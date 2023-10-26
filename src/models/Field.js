const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: String,
  content: String,
  type: {
    type: String,
    enum: ["text", "container"],
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  // As we go up to down, I think it makes sense to keep children in schema
  fields: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
    },
  ],
});

module.exports = mongoose.model("Field", fieldSchema);
