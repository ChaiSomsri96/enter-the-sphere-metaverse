require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-contract-sizer");
require('@openzeppelin/hardhat-upgrades');
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
const { privateKey } = require('./settings.json');

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]    
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      gasMultiplier: 1.25,
      accounts: [privateKey]
    }
  },
  etherscan: {
    apiKey: "SA3H8WKN6WXTNZ2DR36PVVCN9VB892WYBI"
  }
};
