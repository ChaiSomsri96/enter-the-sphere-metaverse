const BITBOXSDK = require("bitbox-sdk");
const BigNumber = require("bignumber.js");
const { GrpcClient } = require("grpc-bchrpc-node");
const { BchdNetwork, LocalValidator } = require("slpjs");
const db = require("../../../../../models");
const config = require("../../../../config");

const createNFT = async (token) => {
  // token sender address

  try {
    console.log("cardId", token.cardId);
    const card = await db.Card.findOne({
      where: {
        id: token.cardId,
      },
    });
    const parentToken = card.tokenId;
    // const parentToken =
    //   "661fa07a6915d9939977233c3b726189200ddc7bd59288c575a69cf223646e0e";

    console.log("parent", parentToken);
    // console.log("parentToken", parentToken);

    const NFT1ParentGroupID = parentToken;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const tokenName = `${card.name} Test NFT (${card.rarity})`;
    const tokenSymbol = `Test NFT (${card.rarity})`;
    const documentUri = card.cardImg;
    const documentHash = "";

    // // NETWORK: FOR MAINNET UNCOMMENT
    const BITBOX = new BITBOXSDK.BITBOX();
    const fundingAddress = config.slpAddress; // <-- must be simpleledger format
    const fundingWif = config.privateKey; // <-- compressed WIF format
    const tokenReceiverAddress = config.slpAddress; // <-- must be simpleledger format
    const bchChangeReceiverAddress = config.slpAddress; // <-- cashAddr or slpAddr format
    console.log("tokenReciver", tokenReceiverAddress);
    // VALIDATOR SETUP: FOR REMOTE VALIDATION
    const client = new GrpcClient({
      url: "bchd.fountainhead.cash:443",
    }); //{ url: "bchd.ny1.simpleledger.io" });
    const getRawTransactions = async (txids) => {
      const txid = txids[0];
      const res = await client.getRawTransaction({
        hash: txid,
        reversedHashOrder: true,
      });
      return [Buffer.from(res.getTransaction_asU8()).toString("hex")];
    };
    const logger = console;
    const validator = new LocalValidator(BITBOX, getRawTransactions, logger);
    const bchdNetwork = new BchdNetwork({ BITBOX, client, validator });

    // Get all balances at the funding address.
    let balances = await bchdNetwork.getAllSlpBalancesAndUtxos(fundingAddress);
    console.log("BCH balance:", balances.satoshis_available_bch);

    // Look at the NFT1 Parent token balance.  Make sure its greater than 0.
    if (
      !balances.slpTokenBalances[NFT1ParentGroupID] ||
      !balances.slpTokenBalances[NFT1ParentGroupID].isGreaterThan(0)
    ) {
      throw Error(
        "Insufficient balance of NFT1 tokens, first you need to create NFT1 parent at this address."
      );
    }

    // Try to find an NFT parent that has quantity equal to 1
    let nftGroupUtxo;
    balances.slpTokenUtxos[NFT1ParentGroupID].forEach((txo) => {
      if (!nftGroupUtxo && txo.slpUtxoJudgementAmount.isEqualTo(1)) {
        nftGroupUtxo = txo;
      }
    });

    console.log("adf", balances.slpTokenUtxos[NFT1ParentGroupID]);

    // If there wasn't any NFT1 parent UTXO with quantity of 1, so we create a TXO w/ qty 1 to be burned.
    if (!nftGroupUtxo) {
      const inputs = [
        ...balances.nonSlpUtxos,
        ...balances.slpTokenUtxos[NFT1ParentGroupID],
      ];
      inputs.map((txo) => (txo.wif = fundingWif));
      const sendTxid = await bchdNetwork.simpleTokenSend(
        NFT1ParentGroupID,
        new BigNumber(1),
        inputs,
        tokenReceiverAddress,
        tokenReceiverAddress
      );

      // wait for transaction to hit the full node.
      console.log("Created new parent UTXO to burn:", sendTxid);
      console.log("Waiting for the Full Node to sync with trans action...");
      await sleep(3000);

      // update balances and set the newly created parent TXO.
      balances = await bchdNetwork.getAllSlpBalancesAndUtxos(fundingAddress);
      balances.slpTokenUtxos[NFT1ParentGroupID].forEach((txo) => {
        if (!nftGroupUtxo && txo.slpUtxoJudgementAmount.isEqualTo(1)) {
          nftGroupUtxo = txo;
        }
      });
    }

    // 3) Set private keys
    const inputs = [nftGroupUtxo, ...balances.nonSlpUtxos];
    inputs.map((txo) => (txo.wif = fundingWif));

    // 4) Use "simpleNFT1ChildGenesis()" helper method
    const genesisTxid = await bchdNetwork.simpleNFT1ChildGenesis(
      NFT1ParentGroupID,
      tokenName,
      tokenSymbol,
      documentUri,
      documentHash,
      token.receiver,
      bchChangeReceiverAddress,
      inputs
    );

    console.log("NFT1 Child GENESIS txn complete:", genesisTxid);

    const outObj = {
      bundledCardId: token.bundleCardId,
      userId: token.userId,
      tokenName,
      tokenSymbol,
      documentHash,
      documentUri,
      tokenId: genesisTxid,
      tokenTx: genesisTxid,
      phase: "pre-alpha",
    };
    await db.NFTToken.create(outObj);
  } catch (error) {
    throw error;
  }
};

module.exports = createNFT;
