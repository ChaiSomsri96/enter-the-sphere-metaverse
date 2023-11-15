const authService = require("../helpers/authservice.helper");

const forgotPasswordController = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = ['Endpoint to send email for forgot password']
  /* #swagger.parameters['body'] = {
    in: "body",
    required: true,
    schema: { $ref: "#/definitions/ForgotPassword" }
  } */
  await authService
    .forgotPassword(req.body, req.get("origin"))
    .then(() => {
      res.json({
        message: "Please check your email for password reset instructions",
      })
    })
    .catch(next);
};

module.exports = forgotPasswordController;
