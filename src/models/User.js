const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  permissions: [
    {
      field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field",
      },
      access: {
        type: String,
        enum: ["view", "edit"],
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
