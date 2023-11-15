const authService = require("../helpers/authservice.helper");

const revokeTokenController = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = ['Endpoint to revoke users token']
  /* #swagger.parameters['body'] = {
    in: "body",
    required: true,
    schema: { $ref: "#/definitions/RevokeToken" }
  } */
  try {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;

    const ipAddress = req.ip;
    console.log("reqa", req.body.user);
    if (!token) return res.status(400).json({ message: "Token is required" });

    // // users can revoke their own tokens and admins can revoke any tokens
    // if (req.body.user.role !== Role.Admin) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    // revokeTokenData.isActive = false;
    // revokeTokenData.isExpired = true;

    const revokeTokenData = await authService.revokeToken({ token, ipAddress });
    console.log("ad", revokeTokenData);

    authService.setTokenCookie(res, "");

    res.json(revokeTokenData).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = revokeTokenController;
