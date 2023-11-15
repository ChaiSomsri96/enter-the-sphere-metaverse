const authRoutes = require("./auth/routes/auth.api");
const bundleRoutes = require("./bundles/routes/bundles.api");
const cardRoutes = require("./cards/routes/cards.api");
const tokenRoutes = require("./tokens/routes/tokens.api");
const transactionRoutes = require("./transactions/routes/transactions.api");
const userRoutes = require("./users/routes/users.api");
const walletRoutes = require("./wallets/routes/wallets.api");
const paymentRoutes = require("./payment/routes/payment.api");
const marketListingRoutes = require("./market-listings/routes/market-listings.api");

const missionsProxy = require('./missions/missions.proxy');

const messagingProxy = require('./messaging/messaging.proxy');


module.exports = function (app) {
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/bundles", bundleRoutes);
    app.use("/api/v1/cards", cardRoutes);
    app.use("/api/v1/tokens", tokenRoutes);
    app.use("/api/v1/transactions", transactionRoutes);
    app.use("/api/v1/wallets", walletRoutes);
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/payments", paymentRoutes);
    app.use("/api/v1/payment", paymentRoutes);
    app.use("/api/v1/marketing-listing", marketListingRoutes);

    app.use("/api/v1/missions", missionsProxy);
    app.use("/api/messaging", messagingProxy);
}
