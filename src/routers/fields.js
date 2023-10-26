const express = require("express");
const router = express.Router();
const { Field, User } = require("../models");
const { addUserOwnership, throwIfNoEditAccess } = require("../utils");

//admin access
router.get("/fields", async (req, res) => {
  try {
    const fields = await Field.find();

    res.json({
      message: "Found",
      data: fields,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: err.message,
    });
  }
});

router.get("/fields/:id", async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      throw new Error("Field was not found");
    }

    res.json({
      message: "Found",
      data: field,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      err,
      message: err.message,
    });
  }
});

router.post("/fields", async (req, res) => {
  try {
    const fieldDto = new Field(req.body);

    switch (fieldDto.type) {
      case "text":
        if (!fieldDto.content) {
          throw new Error("Content is required for a text field");
        }
        break;
      case "container":
        if (!fieldDto.fields) {
          throw new Error("Fields are required for a container");
        }
        break;
      default:
        throw new Error("Incorrect type");
    }
    await throwIfNoEditAccess(fieldDto.parent, req.userId);

    await addUserOwnership(req.userId, fieldDto.id);

    const field = await Field.create(fieldDto);

    res.json({
      message: "Successfuly created!",
      id: field.id,
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
