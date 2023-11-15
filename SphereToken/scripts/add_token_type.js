const hre = require("hardhat");

const sphereTokenContract = "0xDE6E28dBa00F562A78521b20c5852711501f097E";

async function main() {
    const SphereToken = await hre.ethers.getContractFactory("SphereToken");
    const sphereToken = await SphereToken
    .attach(sphereTokenContract);
    
    /*  1,2,3,4,5   */
    let totalSupplies = [
        3055, 1805, 1805, 3055, 367,
        146, 146, 3055, 3055, 367,
        3055, 3055, 3055, 3055, 1805,
        367, 3055, 1805, 3055, 3055,
        1805, 367, 3055, 146, 1805,
        1805, 1805, 146, 178, 178, 
        178, 3055, 3055, 1805, 3055,
        3055, 367, 1805, 1805, 367,
        367, 1805, 1805, 3055, 3055,
        3055, 1805, 1805, 1805, 3055,
        367, 3055, 3055, 367, 367,
        3055, 3055, 178, 3055, 367,
        53, 3055, 367, 1805, 367,
        53, 53, 3055, 3055, 1805
    ];
    let baseTokenURI = "https://gateway.pinata.cloud/ipfs/QmVaExYzNH8Cn3cLrtTBPP334fEv5z6XfhikyEG7mEM4ic/";
    const tx1 = await sphereToken.addInitialTokenType(totalSupplies, baseTokenURI);
    console.log("tx1 ===>  ", tx1);

    let getSecondTokenURI = await sphereToken.uri(71);
    console.log("getSecondTokenURI==>", getSecondTokenURI)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });