const db = require("../../../models");

const createBundlePurchase = async (purchase) => {
  try {
    const purchaseData = await db.Purchase.create(purchase);
    return purchaseData;
  } catch (error) {
    throw error;
  }
};

module.exports = createBundlePurchase;
