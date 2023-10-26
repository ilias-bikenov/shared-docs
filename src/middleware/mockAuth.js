const { User } = require("../models");

const mockAuthMiddleware = async (req, res, next) => {
  try {
    const userIdHeader = req.headers["x-user-id"];
    const user = await User.findById(userIdHeader);

    if (!user) {
      return res.status(401).json({
        message: "Add X-User-ID header",
      });
    }

    req.userId = userIdHeader;
    next();
  } catch (err) {
    res.status(401).json({ message: "User was not found" });
  }
};

module.exports = { mockAuthMiddleware };
