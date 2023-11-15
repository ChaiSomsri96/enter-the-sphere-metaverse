const db = require("../../../models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const nodemailer = require("nodemailer");

const authenticate = async ({ uuid, password, ipAddress }) => {
  const user = await db.User.findOne({
    where: {
      uuid: uuid,
    },
  });
  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(user);
  const refreshToken = await generateRefreshToken(user.id, ipAddress);
  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: refreshToken.token,
  };
};

const refreshToken = async ({ token, ipAddress }) => {
  const refreshToken = await getRefreshToken(token);
  const { userId } = refreshToken;
  // replace old refresh token with a new one and save
  const newRefreshToken = await generateRefreshToken(userId, ipAddress);

  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  refreshToken.userId = userId;
  // console.log("radaf", refreshToken);
  const dadad = await db.RefreshToken.create({
    // expires: JSON.stringify(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    revoked: Date.now(),
    revokedByIp: ipAddress,
    replacedByToken: newRefreshToken.token,
    userId: userId,
    token: refreshToken.token,
    isActive: true,
  });
  // generate new jwt
  const user = await db.User.findOne({
    where: { id: userId },
  });

  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
};

const revokeToken = async ({ token, ipAddress }) => {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.isActive = false;
  refreshToken.isExpired = true;

  const data = await db.RefreshToken.update(refreshToken, {
    where: {
      token,
    },
  });

  return data;
};

const getAll = async () => {
  const users = await db.User.findAll();
  return users.map((x) => basicDetails(x));
};

const getById = async (id) => {
  const user = await getUser(id);
  return basicDetails(user);
};

const getRefreshTokens = async (userId) => {
  // check that user exists
  await getUser(userId);

  // return refresh tokens for user
  const refreshTokens = await db.RefreshToken.find({ where: { id: userId } });
  return refreshTokens;
};

// helper functions

const getUser = async (id) => {
 //  if (!db.isValidId(id)) throw "User not found";
  const user = await db.User.findOne({
    where: {
      id,
    },
  });
  if (!user) throw "User not found";
  return user;
};

const getRefreshToken = async (token) => {
  const refreshToken = await db.RefreshToken.findOne({ where: { token } });
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  return refreshToken;
};

// generate new jwt token
generateJwtToken = (user) => {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: user.uuid, id: user.uuid }, config.jwtSecret, {
    expiresIn: "15m",
  });
};

// generate refresh token
const generateRefreshToken = async (userId, ipAddress) => {
  // create a refresh token that expires in 7 days
  // const user = db.User.findOne({where:{
  //   id: userId
  // }})
  const refreshData = await db.RefreshToken.create({
    userId: userId,
    expires: JSON.stringify(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    token: crypto.randomBytes(40).toString("hex"),
    createdByIP: ipAddress,
    isActive: true,
  });
  // console.log("refresHdata", refreshData);
  return refreshData;
};

// crypto interface for node is retarded
// it is actually sync or async based on whether you give it a callback...
// lets just keep it async for sanity reasons.
const randomTokenString = async () => {
  return crypto.randomBytes(40).toString("hex");
};

const setTokenCookie = (res, token) => {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: false,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    sameSite: "None",
    secure: true,
  };
  res.cookie("refreshToken", token, cookieOptions);
};

// get basic details.
const basicDetails = (user) => {
  const {
    uuid,
    firstName,
    lastName,
		telegramId,
    email,
    role,
    jwtToken,
    refreshToken,
  } = user;
  return { uuid, firstName, lastName, email, role, jwtToken, refreshToken, telegramId };
};

const forgotPassword = async ({ email }, origin) => {
  const account = await db.User.findOne({ where: { email } });
  // always return ok response to prevent email enumeration
  if (!account) return;

  // create reset token that expires after 24 hours
  account.resetToken = await randomTokenString();
  account.resetTokenExpires = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toDateString();

  const update = await db.User.update(
    {
      resetToken: account.resetToken,
      resetTokenExpires: account.resetTokenExpires,
    },
    {
      where: { id: account.id },
    }
  );
  // send email
  await sendPasswordResetEmail(account, origin);
};

async function validateResetToken({ token }) {
  const account = await db.Account.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!account) throw "Invalid token";

  return account;
}
async function resetPassword({ token, password }) {
  const account = await validateResetToken({ token });

  // update password and remove reset token
  account.passwordHash = await hash(password);
  account.passwordReset = Date.now();
  account.resetToken = null;

  const update = await db.User.update(
    {
      passwordHash: account.passwordHash,
      passwordReset: account.passwordReset,
      resetToken: null,
    },
    {
      where: { id: account.id },
    }
  );
}

async function sendPasswordResetEmail(account, origin) {
  let message;
  if (origin) {
    const resetUrl = `${origin}/reset-password?token=${account.resetToken}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken}</code></p>`;
  }
  await sendEmail({
    to: account.email,
    subject: "Enter the Sphere - Reset Password",
    html: `<h4>Reset Password Email</h4>
               ${message}`,
  });
}

const sendEmail = async ({ to, subject, html, from = config.emailFrom }) => {
  const transporter = nodemailer.createTransport(config.smtpOptions);

  return new Promise((resolve, reject) => {
    transporter.sendMail({ from, to, subject, html }, (err, info) => {
      if (err) {
        return reject(err);
      }

      resolve(info);
    });
  });
};

async function sendVerificationEmail(account, origin) {
  let message;
  if (origin) {
    const verifyUrl = `${origin}/verify-email?token=${account.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
                 <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/verify-email</code> api route:</p>
                 <p><code>${account.verificationToken}</code></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: "Sign-up Verification API - Verify Email",
    html: `<h4>Verify Email</h4>
             <p>Thanks for registering!</p>
             ${message}`,
  });
}

async function verifyEmail({ token }) {
  const account = await db.User.findOne({
    where: { verificationToken: token },
  });

  if (!account) throw "Verification failed";

  account.verified = Date.now();
  account.verificationToken = null;

  const update = await db.User.update(
    {
      verificationToken: account.verificationToken,
    },
    {
      where: {
        id: account.id,
      },
    }
  );
}

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  getAll,
  getById,
  getRefreshTokens,
  setTokenCookie,
  randomTokenString,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
