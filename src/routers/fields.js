const express = require("express");
const router = express.Router();
const { Field, User } = require("../models");
const {
  addToParentFields,
  validateFieldAndAddOwnership,
  filterFieldsByViewAccess,
} = require("../utils/fields");

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

// document can be retrieved by id
router.get("/fields/:id", async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      throw new Error("Field was not found");
    }

    if (field.type !== "document") {
      const accessibleField = filterFieldsByViewAccess([field], req.userId);
      if (!accessibleField.length) {
        return res.status(403).json({
          message: "Not permitted",
        });
      }
    }

    const accessibleFields = filterFieldsByViewAccess(field.fields, req.userId);
    field.fields = accessibleFields;

    res.json(field);
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
    await validateFieldAndAddOwnership(req.body, req.userId);

    const field = await Field.create(req.body);

    if (["text", "container"].includes(field.type)) {
      addToParentFields(field.parent, field.id);
    }

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

router.delete("/fields/:id", async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      throw new Error("Field was not found");
    }

    // parent access should be checked here as well
    const accessibleFields = filterFieldsByViewAccess([field], req.userId);
    if (!accessibleFields.length) {
      return res.status(403).json({
        message: "Not permitted",
      });
    }
    await Field.findOneAndRemove({ id: req.params.id });

    let response = {
      message: "Found",
      data: field,
    };

    // Need to remove hanging fields, they can
    // - Be moved up (changing only top elements parent)
    // - Cleaned up recursively, maybe with Cron job as it's not urgent
    if (field.fields.length) {
      response.warning = "There are hanging fields left";
    }

    res.json(response);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      err,
      message: err.message,
    });
  }
});

module.exports = router;
