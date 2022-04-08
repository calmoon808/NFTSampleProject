require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.METAMASK_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: "MRWTQPUU9P3PVK56PZZ6SVDSH6UNZ7WADT",
  }
};
