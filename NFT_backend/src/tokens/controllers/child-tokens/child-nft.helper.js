const BigNumber = require("bignumber.js");
const { GrpcClient } = require("grpc-bchrpc-node");
const bitcore = require('bitcore-lib-cash');
const bchaddr = require('bchaddrjs-slp');
const slpMdm = require('slp-mdm');
const db = require("../../../../models");
const config = require("../../../config");

const fs = require('fs')

const BCHD_URL = config.bchdEndpoint;

const client = new GrpcClient({ url: BCHD_URL });

const fundingAddress = config.cashAddress; // <-- must be simpleledger format
const fundingPrivateKey = config.privateKey; // <-- compressed WIF format

const addressToScripthashCacheMap = new Map();

function addressToScripthash(address) {
    const addressStr = address.toString();

    if (!addressToScripthashCacheMap.has(addressStr)) {
        const script = bitcore.Script.fromAddress(address);
        const scripthash = bitcore.crypto.Hash.sha256(script.toBuffer()).reverse().toString('hex');
        addressToScripthashCacheMap.set(addressStr, scripthash);
    }

    return addressToScripthashCacheMap.get(addressStr);
}

function utxoToBitcoreUnspentOutput(utxo) {
    return new bitcore.Transaction.UnspentOutput({
        txId: utxo.txid,
        outputIndex: utxo.vout,
        script: new bitcore.Script(utxo.pubkey_script),
        satoshis: utxo.value,
    });
}

const gslpAddressCacheMap = new Map();
const getAddressUtxos = async  (address, includeMempool = true) => {

	debuglog(`getAddressUtxos for ${address}`)
    const gutxos = await client.getAddressUtxos({
        address: address.toString(),
        includeMempool,
    });
    const utxos = [];


    for (const output of gutxos.getOutputsList()) {
        const outpoint = output.getOutpoint();

        let slp = null;
        if (output.hasSlpToken()) {
            const gslp = output.getSlpToken()

            slp = {};
            slp.tokenId = Buffer.from(gslp.getTokenId()).toString('hex');
            slp.amount = gslp.getAmount();
            slp.isMintBaton = gslp.getIsMintBaton();

            const gslpAddressStr = gslp.getAddress();


            if (!gslpAddressCacheMap.has(gslpAddressStr)) {
                gslpAddressCacheMap.set(gslpAddressStr, bitcore.Address.fromString(bchaddr.toCashAddress(gslpAddressStr)));
            }
            slp.address = gslpAddressCacheMap.get(gslpAddressStr);
            slp.decimals = gslp.getDecimals();
            slp.slpAction = gslp.getSlpAction();
            slp.tokenType = gslp.getTokenType();

				}

        utxos.push({
            txid: Buffer.from(outpoint.getHash_asU8().reverse()).toString('hex'),
            vout: outpoint.getIndex(),
            value: output.getValue(),
            pubkey_script: Buffer.from(output.getPubkeyScript_asU8()).toString('hex'),
            block_height: output.getBlockHeight(),
            coinbase: output.getIsCoinbase(),
            slp,
        });
    }

  return utxos;
}

async function getAddressNftChildUtxos(address, includeMempool = true) {

	debuglog(`get address nft child utxos for ${address}`)

  const addressStr = address.toString();

  const utxos = await getAddressUtxos(address, includeMempool)


	const filtered = utxos.filter((v) => 
           v.slp
            && v.slp.tokenType === 65
            && v.slp.address.toString() === addressStr
	);
  return filtered;
}

function debuglog(msg){
	console.log(`${logTime()}${msg}`);
}

async function getAddressNftGroupUtxos(address, includeMempool = true) {

	debuglog(`get address nft group utxos for ${address}`)
    const utxos = (await getAddressUtxos(address, includeMempool))
        .filter((v) =>
            v.slp
            && v.slp.tokenType === 129
            // && v.slp.isMintBaton === false
            && v.slp.address.toString() === address
        );

    return utxos;
}

async function getAddressNftMintBatonUtxo(address, includeMempool = true) {
    const addressStr = address.toString();


	debuglog(`get address nft mint baton utxos for ${address}`)

    const utxos = (await getAddressUtxos(address, includeMempool))
        .filter((v) =>
            v.slp
            && v.slp.tokenType === 129
            && v.slp.isMintBaton === true
            && v.slp.address.toString() === addressStr
        );

    return utxos.length > 0 ? utxos[0] : null;
}

async function getAddressBchUtxos(address, includeMempool = true) {

	debuglog(`get address bch utxos for ${address}`)
    const utxos = (await getAddressUtxos(address, includeMempool))
        .filter((v) => !v.slp);

	for (const utxo of utxos){
		debuglog(utxo)
	}

    return utxos;
}

async function getAddressBchBalance(address, includeMempool = true) {
    const utxos = await getAddressBchUtxos(address, includeMempool);
    return utxos.reduce((a, v) => a + v.value, 0);
}

function logTime(){
	return (new Date().getTime()/1000)%3600 + ": "
}


async function createGroupSplitTx(
    address,
    privateKey,
    includeMempool = true,
    toAddress,
    tokenId,
) {

	debuglog(`CreateGroupSplitTx address: ${address}, to: ${toAddress}, tokenId: ${tokenId}`)
    const bchUtxos = await getAddressBchUtxos(address, includeMempool);
    const balance = bchUtxos.reduce((a, v) => a + v.value, 0);


	debuglog(`address collected: balance: ${balance}`)

    if (balance < 20000) {
        throw new Error('balance too low');
    }

    const groupUtxosUnfiltered = await getAddressNftGroupUtxos(address, includeMempool);

		const groupUtxos = groupUtxosUnfiltered
        .filter((v) => v.slp.tokenId === tokenId)
        .filter((v) => v.slp.amount > 0);

		if (groupUtxos.filter(v=>v.slp.amount==1).length > 0 ){
			console.log("have outputs with 1 token. No need to split");
			return null;  // null means there is no need to do split and do transaction
		}

    if (groupUtxos.length === 0) {
      throw new Error(`${logTime()}no splittable ${tokenId} utxos found`);
    }


    const groupUtxo = groupUtxos[0];
    const groupUtxoAmount = groupUtxo.slp.amount;

    const inputUtxos = [utxoToBitcoreUnspentOutput(groupUtxo)];
    // lets only use some utxos so we dont hit size limit
    for (const utxo of bchUtxos) {
        inputUtxos.push(utxoToBitcoreUnspentOutput(utxo));

        if (inputUtxos.reduce((a, v) => a + v.satoshis, 0) > 20000) {
            break;
        }
    }

    const slpOutputAmounts = [];
    for (let i = 0; i < groupUtxoAmount && i < 18; ++i) {
        slpOutputAmounts.push(new slpMdm.BN(1));
    }
    if (groupUtxoAmount > 18) {
        slpOutputAmounts.push(new slpMdm.BN(groupUtxoAmount - 18));
    }

    let tx = new bitcore.Transaction()
        .from(inputUtxos)
        .addOutput(new bitcore.Transaction.Output({
            script: bitcore.Script.fromBuffer(slpMdm.NFT1.Group.send(tokenId, slpOutputAmounts)),
            satoshis: 0
        }));
    for (const amount of slpOutputAmounts) {
        tx = tx.to(toAddress, 546);
    }

    tx = tx
        .change(address) // we send remaining bch back to users deposit address
        .feePerByte(1.2)
        .sign(privateKey);

    return tx;
}

 const createChildGenesisTx = async (
    address,
    privateKey,
    includeMempool = true,
    toAddress,
    groupTokenId,
    name,
    symbol,
    documentUri,
    documentHash,
)  => {

	console.log(`CreateChildGenesisTx address: ${address}, to: ${toAddress}, groupTokenId: ${groupTokenId}, name: ${name}`);

    const bchUtxos = await getAddressBchUtxos(address, includeMempool);

    const balance = bchUtxos.reduce((a, v) => a + v.value, 0);
    if (balance < 5000) {
        throw new Error('balance too low');
    }
    const groupUtxos = (await getAddressNftGroupUtxos(address, includeMempool))
        .filter((v) => v.slp.tokenId === groupTokenId)
        .filter((v) => v.slp.amount === '1');
        if (groupUtxos.length === 0) {
        throw new Error(`no usable amount 1 ${groupTokenId} utxos found`);
    }

    const groupUtxo = groupUtxos[0];
 //   console.log('groupUtxos', groupUtxos)

    const inputUtxos = [utxoToBitcoreUnspentOutput(groupUtxo)];
 //   console.log('inputUtxos', inputUtxos)

    // lets only use some utxos so we dont hit size limit
    for (const utxo of bchUtxos) {
        inputUtxos.push(utxoToBitcoreUnspentOutput(utxo));
    
        if (inputUtxos.reduce((a, v) => a + v.satoshis, 0) > 5000) {
            break;
        }
    }

    const tx = new bitcore.Transaction()
        .from(inputUtxos)
        .addOutput(new bitcore.Transaction.Output({
            script: bitcore.Script.fromBuffer(slpMdm.NFT1.Child.genesis(symbol, name, documentUri, "")),
            satoshis: 0
        }))
        .to(toAddress, 546)
        .change(address) // we send remaining bch back to users deposit address
        .feePerByte(1.2)
        .sign(privateKey);
    return tx;
}


// DO NOT ENABLE ALLOWBURN UNLESS YOU EXPAND THIS LIBRARY
async function broadcastTx(tx, allowBurn = false) {

	debuglog("broadcastTx")

    const res = await client.submitTransaction({
        txnHex: tx.serialize(),
        skipSlpValidityChecks: allowBurn,
    });

    return Buffer.from(res.getHash_asU8()).reverse().toString('hex');
}

async function example() {
    // console.log('fundingAddress', fundingAddress.toString());

    // USE THESE TO DEBUG YOUR CURRENT UTXOS
    // const allUtxos = await getAddressUtxos(fundingAddress);
    // const bchUtxos = await getAddressBchUtxos(fundingAddress);
    // const groupUtxos = await getAddressUtxos(fundingAddress);
    // const nftUtxos = await getAddressNftChildUtxos(fundingAddress);

    // console.log('allUtxos', allUtxos);
    // console.log('bchUtxos', bchUtxos);
    // console.log('groupUtxos', groupUtxos);
    // console.log('nftUtxos', nftUtxos);

    /*
    // USE THIS TO SPLIT GROUP TOKENS
    // RUN THIS REGULARLY SO THAT YOU HAVE MANY GROUP TOKENS AVAILABLE
    // DO NOT RUN THIS AS PART OF CHILD TOKEN GENESIS... RUN IT BEFOREHAND

    const tx = await createGroupSplitTx(fundingAddress, fundingPrivateKey, true, fundingAddress, "2efd877ff5f6e0b9ec1bdec5d6cfab888c4fcf7489df4063929ef2ac42cdd817");
    console.log("tx", tx.toString());
    try {
        const txid = await broadcastTx(tx);
        console.log("txid", txid);
    } catch (e) {
        console.error(`broadcastTx failed ${e.message}`);
        return null;
    }
    */


    /*
    // USE THIS TO MAKE CHILD TOKENS

    const tx = await createChildGenesisTx(
        fundingAddress,
        fundingPrivateKey,
        true,
        fundingAddress,
        "2efd877ff5f6e0b9ec1bdec5d6cfab888c4fcf7489df4063929ef2ac42cdd817",
        "child name",
        "child symbol",
        "https://document.website",
        "",
    );
    console.log("tx", tx.toString());
    try {
        const txid = await broadcastTx(tx);
        console.log("txid", txid);
    } catch (e) {
        console.error(`broadcastTx failed ${e.message}`);
        return null;
    }
    */
}
example();


// USE THIS TO MAKE CHILD TOKENS
const createChildToken = async (token) => {
	debuglog(`STARTED createChildToken ${token}`)
    try { 

        const card = await db.Card.findOne({
            where: {
              id: token.cardId,
            },
          });
          
        const parentToken = card.tokenId
 //       console.log('card', card)
        const tokenName = `${card.name} (${config.tokenEpoch})`;
        const tokenSymbol = config.tokenTicker;// `${card.name} SPHERE (${card.rarity})`;
        const documentUri = card.cardImage;//"https://enter-the-sphere.com";
        const documentHash = "";    
    
    //  const groupUtxos = await getAddressUtxos(fundingAddress);
    //  console.log('agd', groupUtxos)     
       
			debuglog(`STARTED create group split tx`)
     const groupTx = await createGroupSplitTx(fundingAddress, fundingPrivateKey, true, fundingAddress, parentToken);
			debuglog(`GENERATED create group split tx `)

			if (groupTx !== null ){
        try {
          const txid = await broadcastTx(groupTx);

					debuglog(`DONE create group split tx ${txid}`);

        } catch (e) {
            console.error(`broadcastTx failed ${e.message}`);
            return null;
        }
			}
    
		debuglog(`STARTED create child genesis tx `)
    const tx = await createChildGenesisTx(
        fundingAddress,
        fundingPrivateKey,
        true,
        token.receiver,
        parentToken,
        tokenName,
        tokenSymbol,
        documentUri,
        documentHash,
    );

		debuglog(`GENERATED create child genesis tx `)

    const txid = await broadcastTx(tx);
		debuglog(`DONE create child genesis tx ${tx}`)
    return txid;
	} catch (e) {
			console.error(`broadcastTx failed ${e.message}`);
			return null;
	}
}


const fetchSLPBalances = async(slpSrc)=>{
	debuglog(`fetchSLPBalances(${slpSrc})`);
	const groupUtxosUnfiltered = await getAddressNftGroupUtxos(slpSrc);
	debuglog(`groupUtxosUnfiltered=${groupUtxosUnfiltered}`)
	let groupSLP = {};
	groupUtxosUnfiltered
        .filter((v) => v.slp.isMintBaton == false && v.slp.amount > 0).forEach(v=>{
					groupSLP[v.slp.tokenId] = ( groupSLP[v.slp.tokenId] || 0 ) + parseInt(v.slp.amount);
				});

	debuglog(`balance: ${JSON.stringify(groupSLP)}`)

	return groupSLP;
}

/***
 * tokenId 
 * slpSrc: bitcoincash:address where to take token
 * slpDst: bitcoincash:address where transfer token to
 * slpKey: private wif key for slpSrc
 * bchSrc: from which address pay the transaction fee
 * bchKey: private wif key for bchSrc
 */
const transferToken = async(tokenId, slpSrc, slpDst, slpKey, bchSrc, bchKey)=>{

	slpSrc = bchaddr.toCashAddress(slpSrc);
	slpDst = bchaddr.toCashAddress(slpDst);

	console.log(`transfer ${tokenId} from ${slpSrc} => ${slpDst}`)

	const slpBalance = (await getAddressNftChildUtxos(slpSrc,true))
		.filter(v=>v.slp.tokenId===tokenId)
		.filter(v=>v.slp.amount>=1);

	console.log(slpBalance)

	if (slpBalance.length===0){
		console.error(`not enought tokens ${tokenId} at ${slpSrc}`);
		throw new Error(`not enough tokens`);
	}

  const bchUtxos = await getAddressBchUtxos(bchSrc, true);
  const balance = bchUtxos.reduce((a, v) => a + v.value, 0);

	console.log(`BCH balance ${balance}`);
  if (balance < 2000) {
      throw new Error('balance too low');
  }

	console.log(`bchUtxos ${JSON.stringify(bchUtxos)}`);

	const inputUtxos = [utxoToBitcoreUnspentOutput(slpBalance[0])];

	let accounted = 0;
	for (const utxo of bchUtxos) {
		inputUtxos.push(utxoToBitcoreUnspentOutput(utxo));
		accounted+=utxo.satoshis;
		if (accounted >= 1000) {
			break;
		}
	}

	const slpOutputAmounts = [];
	slpOutputAmounts.push(new slpMdm.BN(1));
	let tx = new bitcore.Transaction()
		.from(inputUtxos)
		.addOutput(new bitcore.Transaction.Output(
			{
				script: bitcore.Script.fromBuffer(slpMdm.NFT1.Child.send(tokenId, slpOutputAmounts,0x41)), 
				satoshis: 0
			},
		))
		.to(slpDst,546)
		.change(bchSrc)
		.feePerByte(1.2)
		.sign([slpKey,bchKey]);

	console.log(`broadcasting tx: ${tx}`);
	const txid = await broadcastTx(tx);
	console.log(txid);
	return txid;
}

const transferBch = async (from, to, amount, privateKey)=>{

	const includeMempool = true;
	
	const bchUtxos = await getAddressBchUtxos(from, includeMempool);
	const balance = bchUtxos.reduce((a, v) => a+v.value, 0);

	if (balance < amount) {
			throw new Error('balance too low');
	}

	const inputUtxos = [];
	// lets only use some utxos so we dont hit size limit
	for (const utxo of bchUtxos) {
			inputUtxos.push(utxoToBitcoreUnspentOutput(utxo));

			if (inputUtxos.reduce((a, v) => a+v.satoshis, 0) > amount) {
					break;
			}
	}

	const tx = new bitcore.Transaction()
			.from(inputUtxos)
			.to(to, amount) // mint baton
			.change(from) // we send remaining bch back to users address
			.feePerByte(1.2)
			.sign(privateKey);

	const txid = await broadcastTx(tx);
	console.log(txid);
	return txid;
}

const createGroupGenesisTx = async(
    address,
    privateKey,
    includeMempool,
    toAddress,
    name,
    symbol,
    documentUri,
    documentHash,
		qty,
)=>{
	const bchUtxos = await getAddressBchUtxos(address, includeMempool);
	const balance = bchUtxos.reduce((a, v) => a+v.value, 0);

	if (balance < 5000) {
			throw new Error('balance too low');
	}

	const inputUtxos = [];
	// lets only use some utxos so we dont hit size limit
	for (const utxo of bchUtxos) {
			inputUtxos.push(utxoToBitcoreUnspentOutput(utxo));

			if (inputUtxos.reduce((a, v) => a+v.satoshis, 0) > 5000) {
					break;
			}
	}

	const tx = new bitcore.Transaction()
			.from(inputUtxos)
			.addOutput(new bitcore.Transaction.Output({
					script: bitcore.Script.fromBuffer(slpMdm.NFT1.Group.genesis(symbol, name, documentUri, documentHash, 0, 2, new slpMdm.BN(qty))),
					satoshis: 0
			}))
			.to(toAddress, 546) // 0 group output
			.to(toAddress, 546) // mint baton
			.change(address) // we send remaining bch back to users address
			.feePerByte(1.2)
			.sign(privateKey);

	console.log(`broadcasting tx: ${tx}`);
	const txid = await broadcastTx(tx);
	console.log(txid);
	return txid;
}


const fetchBCHBalance = async (bchSrc)=>{

	const bchUtxos = await getAddressBchUtxos(bchSrc, true);
	const balance = bchUtxos.reduce((a, v) => a + v.value, 0);

	return balance;
}


module.exports = { createChildToken, transferToken, fetchSLPBalances, createGroupGenesisTx,transferBch, fetchBCHBalance}
