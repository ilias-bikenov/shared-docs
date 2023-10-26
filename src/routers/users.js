const express = require("express");
const router = express.Router();
const { User } = require("../models");

//admin access
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      message: "Found",
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: err.message,
    });
  }
});

router.post("/users", async (req, res) => {
  try {
    const userDto = new User(req.body);
    const user = await User.create(userDto);

    res.json({
      message: "Successfuly created!",
      id: user.id,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      err,
      message: err.message,
    });
  }
});

module.exports = router;
