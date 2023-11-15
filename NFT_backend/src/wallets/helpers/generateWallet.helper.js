const BCHJS = require("@psf/bch-js");
const db = require("../../../models");

// Set NETWORK to either testnet or mainnet
const NETWORK = "mainnet";

// REST API servers.
const BCHN_MAINNET = "https://bchn.fullstack.cash/v3/";
// const ABC_MAINNET = 'https://abc.fullstack.cash/v3/'
const TESTNET3 = "https://testnet3.fullstack.cash/v3/";

// Instantiate bch-js based on the network.
let bchjs;
if (NETWORK === "mainnet") bchjs = new BCHJS({ restURL: BCHN_MAINNET });
else bchjs = new BCHJS({ restURL: TESTNET3 });

const generateWallet = async (userId) => {
  const lang = "english";
  const outObj = {};

  // create 128 bit BIP39 mnemonic
  const mnemonic = bchjs.Mnemonic.generate(
    128,
    bchjs.Mnemonic.wordLists()[lang]
  );

  outObj.mnemonic = mnemonic;

  // root seed buffer
  const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic);

  // master HDNode
  let masterHDNode;
  if (NETWORK === "mainnet") masterHDNode = bchjs.HDNode.fromSeed(rootSeed);
  else masterHDNode = bchjs.HDNode.fromSeed(rootSeed, "testnet"); // Testnet

  // HDNode of BIP44 account
  const account = bchjs.HDNode.derivePath(masterHDNode, "m/44'/245'/0'");

  for (let i = 0; i < 10; i++) {
    const childNode = masterHDNode.derivePath(`m/44'/245'/0'/0/${i}`);

    if (i === 0) {
      outObj.cashAddress = bchjs.HDNode.toCashAddress(childNode);
      outObj.slpAddress = bchjs.SLP.Address.toSLPAddress(outObj.cashAddress);
      outObj.legacyAddress = bchjs.Address.toLegacyAddress(outObj.cashAddress);
      outObj.privatekey = bchjs.HDNode.toWIF(childNode);
    }
  }

  // derive the first external change address HDNode which is going to spend utxo
  const change = bchjs.HDNode.derivePath(account, "0/0");
  outObj.userId = userId;
  // get the cash address
  bchjs.HDNode.toCashAddress(change);

  const wallet = await db.SafeWallet.create({
    userId: userId,
    cashAddress: outObj.cashAddress,
    slpAddress: outObj.slpAddress,
    legacyAddress: outObj.slpAddress,
    privateKey: outObj.privatekey,
    mnemonic: outObj.mnemonic,
  });
  // console.log("wallet", wallet, wallet2);
  return wallet;
};

module.exports = generateWallet;

// const wallet2 = await db.TradeWallet.create({
//   userId: userId,
//   cashAddress: outObj.cashAddress,
//   slpAddress: outObj.slpAddress,
//   legacyAddress: outObj.slpAddress,
//   mnemonic: outObj.mnemonic,
//   privateKey: outObj.privatekey,
// });
