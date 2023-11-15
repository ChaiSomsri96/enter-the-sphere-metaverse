const db = require("../../../models");
const createBundlePurchase = require("../../bundles/helpers/createBundlepurcahse.helper");
const generateBundleforUser = require("../../bundles/helpers/generateBundle.helper");

const stripe = require('../helpers/stripe.helper');

const paymentSession = async (req, res, next) => {
  try {
    console.log("id", req.query.id);
    const session = await stripe.checkout.sessions.retrieve(req.query.id, {
      expand: ["line_items"],
    });
    if (session.payment_status === "paid") {
      const quantity = session.line_items.data[0].quantity;
      const userUuid = session.metadata.uuid;
      console.log("userId", userUuid);

      const user = await db.User.findOne({
        where: {
          uuid: userUuid,
        },
      });
      console.log("usr", user);

      const purchaseObj = {
        status: session.payment_status,
        quantity: session.line_items.data[0].quantity,
        paymentMethod: "stripe",
        price: session.line_items.data[0].amount_subtotal / 100,
        userId: user.id,
      };
      console.log("pu", purchaseObj);
      const purchase = await createBundlePurchase(purchaseObj);
      console.log("purchase", purchase);
      // generate bundles based on quantity. Each bundle has 5 cards
      for (let i = 0; i < quantity; i++) {
        await generateBundleforUser(user.id, purchase.id, 5);
      }

      console.log("quantity", quantity);
    }
    res.json("Payment successful");
  } catch (error) {
    next(error);
  }
};

module.exports = paymentSession;
