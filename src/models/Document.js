const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: String,
  fields: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
    },
  ],
});

module.exports = mongoose.model("Document", documentSchema);
