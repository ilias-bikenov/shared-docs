const { User, Field } = require("../models");

const filterFieldsByViewAccess = async (fields, userId) => {
  const user = await User.findById(userId);

  return fields.filter((field) => {
    const userPermission = user.permissions.find((permission) =>
      permission.field.equals(field.id)
    );

    return userPermission && userPermission.access === "view";
  });
};

const filterFieldsByEditAccess = async (fields, userId) => {
  const user = await User.findById(userId);
  console.log(user);
  console.log("fields", fields);
  return fields.filter((field) => {
    const userPermission = user.permissions.find((permission) =>
      permission.field.equals(field?.id)
    );
    return userPermission && userPermission.access === "edit";
  });
};

const addUserOwnership = async (userId, fieldId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        permissions: {
          field: fieldId,
          access: "edit",
        },
      },
    },
    { new: true, upsert: true }
  );
};

const throwIfNoEditAccess = async (fieldId, userId) => {
  const filteredFields = await filterFieldsByEditAccess(
    [{ id: fieldId }],
    userId
  );

  if (!filteredFields.length) {
    throw new Error("Insufficient permissions to edit the field");
  }
};

module.exports = {
  filterFieldsByViewAccess,
  filterFieldsByEditAccess,
  addUserOwnership,
  throwIfNoEditAccess,
};
