import "@nomiclabs/hardhat-ethers";

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/7xeGs22pDCMlsMC5ZiasB0XfC41g0F9z",
        blockNumber: 13190400
      },
      chainId: 1337
    }
  }
};