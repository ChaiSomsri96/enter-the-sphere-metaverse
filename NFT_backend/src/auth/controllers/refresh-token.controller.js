const authService = require("../helpers/authservice.helper");

const refreshTokenController = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = ['Endpoint to refresh users token']
  try {
    console.log(req.cookies);
    const token = req.cookies.refreshToken;
    console.log("token", token);
    const ipAddress = req.ip;

    const refreshData = await authService.refreshToken({ token, ipAddress });
    console.log("reafvda", refreshData);
    authService.setTokenCookie(res, refreshData.refreshToken);

    res.json(refreshData).status(201);
  } catch (error) {
    next(error);
  }
};

module.exports = refreshTokenController;
