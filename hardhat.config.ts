import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETH_MAINNET_RPC,
        blockNumber: 13411400
      },
      chainId: 1337
    }
  }
};