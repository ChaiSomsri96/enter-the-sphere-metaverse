const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const errorHandler = require("./helpers/error-handler.helper");
const exphbs = require("express-handlebars");
const path = require("path");
const Coinpayments = require("coinpayments");
const cors = require("cors");
const cookies = require("cookie-parser");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const config = require('./config');

const Sentry = require ("@sentry/node");

// set timers to run jobs in a loop
const juungleSetPrice = require('./jobs/juungle-set-price.job');
const {scheduleJuungleWithdrawals, schedulePayouts} = require('./jobs/payouts.job');

// Withdraw from juungle every 30 minutes
scheduleJuungleWithdrawals(1800);

// Payout to users every 60 minutes
schedulePayouts(3600);

Sentry.init({
  dsn: config.sentryDsn,
  tracesSampleRate: config.sentrySampleRate,
});


// TODO is this used for anything?
const client = new Coinpayments({
  key: "cad7efc5560063816c0928016e4284bc4d46db4d83112fd2f2c1a7b43e026ab8",
  secret: "3FdA48f757e5c67802cB6177651ef2bf63Dfa36B94E8B65F0269efa73858EcFd",
});

app.use(Sentry.Handlers.requestHandler());

app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(cookies());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./endpoints')(app);
app.get('/healthcheck', (req,res)=>{
	res.status(200).json({});
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);
app.disable("etag");

module.exports = app; 

