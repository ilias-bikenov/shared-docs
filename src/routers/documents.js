const express = require("express");
const router = express.Router();
const { Document } = require("../models");
const { filterFieldsByUserAccess } = require("../utils");

//admin access
router.get("/documents", async (req, res) => {
  const documents = await Document.find();

  res.json({
    data: documents,
  });
});

router.get("/documents/:id", async (req, res) => {
  const document = await Document.findById(req.params.id).populate("fields");

  if (!document) {
    throw new Error("Document was not found");
  }

  const accessibleFields = filterFieldsByUserAccess(
    document?.fields,
    req.userId
  );

  res.json({
    title: document.title,
    fields: accessibleFields,
  });
});

router.post("/documents", async (req, res) => {
  try {
    const docDto = new Document(req.body);
    const document = await Document.create(docDto);

    res.json({
      message: "Successfuly created!",
      id: document.id,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      err,
    });
  }
});

router.patch("/documents/:id", async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body);

    if (!document) {
      throw new Error("Document was not found");
    }

    res.json({
      message: "Successfuly updated!",
      id: document.id,
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
