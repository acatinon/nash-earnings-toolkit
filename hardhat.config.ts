import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
        blockNumber: 13411400
      },
      chainId: 1337
    }
  }
};