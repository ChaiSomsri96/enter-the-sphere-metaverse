const config = require("../../config");

const stripe = require('../helpers/stripe.helper');
const YOUR_DOMAIN = config.frontUrl;

const createPaymentSession = async (req, res, next) => {
  console.log("ad", req.body.userId);

  let qty = req.body.quantity;
  if (qty < 1) {
    qty=1;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Master Forge",
            images: ["https://s4.gifyu.com/images/lootbox.gif"],
          },
          unit_amount: 200,
        },
        quantity: qty,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/lootbox/success?id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}`,
    metadata: {
      uuid: req.body.userId,
    },
  });
  res.json(
    JSON.parse(
      JSON.stringify({
        id: session.id,
      })
    )
  );
};

module.exports = createPaymentSession;
