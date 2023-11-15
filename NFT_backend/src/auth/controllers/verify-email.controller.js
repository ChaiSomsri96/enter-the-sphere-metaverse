const verifySchema = require("../schemas/verify-email.schema");
const authService = require("../helpers/authservice.helper");

const verifyEmail = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = ['Endpoint to verify users email']
  /* #swagger.parameters['body'] = {
    in: "body",
    required: true,
    schema: { $ref: "#/definitions/VerifyEmail" }
  } */
  try {
    const body = await verifySchema.validateAsync(req.body);

    const verify = await authService.verifyEmail(body);

    res.json(verify);
  } catch (error) {
    next(error);
  }
};

module.exports = verifyEmail;
