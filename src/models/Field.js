const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: String,
  content: String,
  type: {
    type: String,
    // previously there was Document model, but in core it doesn't differ from a field by definition
    enum: ["text", "container", "document"],
    required: true,
  },
  // thought about putting this into user, due to payload size limit, but it makes
  // permissions management hard
  permissions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      access: {
        type: String,
        enum: ["view", "edit"],
      },
    },
  ],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
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
