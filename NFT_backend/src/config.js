require("dotenv").config();

const config = {
  port: process.env.PORT||5000,
  jwtSecret: process.env.JWT_SECRET||'secret',
  cashAddress: process.env.CASH_ADDRESS,
  slpAddress: process.env.SLP_ADDRESS,
  legacyAddress: process.env.LEGACY_ADDRESS,
  privateKey: process.env.PRIVATE_KEY,
  frontUrl: process.env.FRONT_URL,

	cardSuffix: process.env.CARD_ENV_SUFFIX,
  tokenEpoch: process.env.TOKENS_EPOCH_NAME,
  tokenTicker: process.env.TOKEN_TICKER,

  sentryDsn: process.env.SENTRY_SERVER_URL,
  sentrySampleRate: process.env.SENTRY_SAMPLE_RATE,

	bchdEndpoint: 'bchd.fountainhead.cash:443',

	coinpaymentsPublic: process.env.COINPAYMENTS_PUBLIC,
	coinpaymentsPrivate: process.env.COINPAYMENTS_PRIVATE,


	redisHost: process.env.REDIS_HOST,
	redisPort: process.env.REDIS_POR||6379,

  imgixSecret: process.env.IMGIX_SECRET,

  emailFrom: "admin@enter-the-sphere.com",

  juungleEmail: process.env.JUUNGLE_EMAIL,
  juunglePassword: process.env.JUUNGLE_PASSWORD,
  // TODO set this based on environment
  /*
  smtpOptions: {
    host: "mail.postale.io",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "admin@enter-the-sphere.com", // generated ethereal user
      pass: "P3viVWexo9Qq", // generated ethereal password
    },
  },
  */
  // we use stream transport for testing
  // this prevents emails from actually being sent
  // https://nodemailer.com/transports/stream/
  smtpOptions: {
    streamTransport: true,
  },
};

module.exports = config;
