const { Field } = require("../models");

const ensureParentExistense = async (parentId) => {
  const parent = await Field.findById(parentId);

  if (!parent) {
    throw new Error("Correct parent field ID should be provided");
  }
};

const filterFieldsByViewAccess = (fields, userId) => {
  return fields.filter((field) => {
    console.log(field);
    const userPermission = field?.permissions?.find((permission) =>
      permission?.user?.equals(userId)
    );
    console.log(userPermission.access);
    return userPermission && ["view", "edit"].includes(userPermission.access);
  });
};

const filterFieldsByEditAccess = async (fields, userId) => {
  return fields.filter((field) => {
    const userPermission = field.permissions.find((permission) =>
      permission.user.equals(userId)
    );
    return userPermission && userPermission.access === "edit";
  });
};

const addUserOwnership = async (field, userId) => {
  field.permissions = [
    {
      user: userId,
      access: "edit",
    },
  ];

  return field;
};

const addToParentFields = async (parentId, fieldId) => {
  await Field.findByIdAndUpdate(
    parentId,
    {
      $push: {
        fields: fieldId,
      },
    },
    { new: true, upsert: true }
  );
};

const throwIfNoEditAccess = async (parentId, userId) => {
  const parent = await Field.findById(parentId);

  const filteredFields = await filterFieldsByEditAccess([parent], userId);

  // by definition docs have no access management
  if (!filteredFields.length && parent?.type !== "document") {
    throw new Error("Insufficient permissions to edit the field");
  }
};

const validateFieldAndAddOwnership = async (fieldData, userId) => {
  await Field.validate(fieldData);

  switch (fieldData.type) {
    case "text":
      if (!fieldData.content) {
        throw new Error("Content is required for a text field");
      }
      await ensureParentExistense(fieldData.parent);
      await throwIfNoEditAccess(fieldData.parent, userId);
      break;
    case "container":
      if (!fieldData.fields) {
        throw new Error("Fields are required for a container");
      }
      //recursive check should be performed?
      if (fieldData.fields.includes(fieldData.parent)) {
        throw new Error("Parent element can't be inside child fields");
      }

      await ensureParentExistense(fieldData.parent);
      await throwIfNoEditAccess(fieldData.parent, userId);

      addUserOwnership(fieldData, userId);
      break;
    case "document":
      // no restrictions by user story
      break;
    default:
      throw new Error("Incorrect type");
  }
};

module.exports = {
  validateFieldAndAddOwnership,
  filterFieldsByViewAccess,
  filterFieldsByEditAccess,
  throwIfNoEditAccess,
  addToParentFields,
};
