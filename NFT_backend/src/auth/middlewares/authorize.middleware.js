const jwt = require("express-jwt");
const { jwtSecret } = require("../../config");
const db = require("../../../models");

module.exports = authorize;

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret: jwtSecret, algorithms: ["HS256"] }),

    // authorize based on user role
    async (req, res, next) => {
      console.log("req.body", req.user);
      const user = await db.User.findOne({
        where: {
          uuid: req.user.id,
        },
      });

	  req.user_id = user.id;

      if (!user || (roles.length && !roles.includes(user.role))) {
        // user no longer exists or role not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }

      // authentication and authorization successful
      req.user.role = user.role;
      const refreshTokens = await db.RefreshToken.findOne({
        where: {
          id: user.id,
        },
      });
      req.user.ownsToken = (token) =>
        !!refreshTokens.find((x) => x.token === token);
      next();
    },
  ];
}
