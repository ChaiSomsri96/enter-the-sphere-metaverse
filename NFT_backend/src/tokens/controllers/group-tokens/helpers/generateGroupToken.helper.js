//const { BigNumber } = require("bignumber.js");
//const BITBOXSDK = require("bitbox-sdk");
//const { GrpcClient } = require("grpc-bchrpc-node");
//const { BchdNetwork, LocalValidator } = require("slpjs");

//const BITBOX = new BITBOXSDK.BITBOX();



// const BITBOX = new BITBOXSDK.BITBOX({
//   restURL: "bchd.fountainhead.cash:443",
// });

const config = require("../../../../config");
const {createGroupGenesisTx} =require ("../../child-tokens/child-nft.helper");

// wallet = {
//   slpAddress,
//   privatekey,
// }

// token = {
//   tokenName,
//   tokenSymbol,
//   documentUri,
//   documentHash,
//   totalSupply
// }

const generateGroupTokenHelper = async (token) => {
  try {
    console.log("started");
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const fundingAddress = config.slpAddress; // <-- must be simpleledger format
    const fundingWif = config.privateKey; // <-- compressed WIF format
    const tokenReceiverAddress = config.slpAddress; // <-- must be simpleledger format
    const bchChangeReceiverAddress = config.slpAddress; // <-- cashAddr or slpAddr format
    // For unlimited issuance provide a "batonReceiverAddress"
    const batonReceiverAddress = config.slpAddress;

		const genesisTxid = await createGroupGenesisTx(
			config.cashAddress,
			fundingWif, 
			true, 
			config.cashAddress,
			token.tokenName, 
			token.tokenSymbol, 
			token.documentUri, 
			token.documentHash,
		  token.totalSupply,
		);

		/*
    // const grpc = new GrpcClient.GrpcClient({ url: 'bchd.fountainhead.cash:443' });

    // VALIDATOR SETUP: FOR REMOTE VALIDATION
    const client = new GrpcClient({
      url: "bchd.fountainhead.cash:443",
    }); //{ url: "bchd.ny1.simpleledger.io" });
    console.log("client", client);
    const getRawTransactions = async (txids) => {
      const txid = txids[0];
      await sleep(1000);

      const res = await client.getRawTransaction({
        hash: txid,
        reversedHashOrder: true,
      });
      return [Buffer.from(res.getTransaction_asU8()).toString("hex")];
    };
    const logger = console;
    const validator = new LocalValidator(BITBOX, getRawTransactions, logger);
    const bchdNetwork = new BchdNetwork({ BITBOX, client, validator, logger });

    // 1) Get all balances at the funding address.
    const balances = await bchdNetwork.getAllSlpBalancesAndUtxos(
      fundingAddress
    );
    console.log("BCH balance:", balances.satoshis_available_bch);

    // 2) Calculate the token quantity with decimal precision included
    const initialTokenQtyBN = new BigNumber(token.totalSupply);

    // 3) Set private keys
    balances.nonSlpUtxos.forEach((txo) => (txo.wif = fundingWif));

    const genesisTxid = await bchdNetwork.simpleNFT1ParentGenesis(
      token.tokenName,
      token.tokenSymbol,
      initialTokenQtyBN,
      token.documentUri,
      token.documentHash,
      tokenReceiverAddress,
      batonReceiverAddress,
      bchChangeReceiverAddress,
      balances.nonSlpUtxos
    );
		*/

    console.log("NFT1 Parent GENESIS txn complete:", genesisTxid);
    const outObj = {
      tokenName: token.tokenName,
      tokenSymbol: token.tokenSymbol,
      documentHash: token.documentHash,
      documentUri: token.documentUri,
      totalSupply: token.totalSupply,
      tokenTx: genesisTxid,
    };

    return outObj;
  } catch (error) {
		console.trace(error);
    throw error;
  }
};

module.exports = generateGroupTokenHelper;
