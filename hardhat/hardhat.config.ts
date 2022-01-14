import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), "..", ".env.local")});

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