import "dotenv/config";
import { ethers } from "ethers";
import { DateTime } from "luxon";
import BigNumber from "bignumber.js";
import InputDataDecoder from "ethereum-input-data-decoder";
import { getContract } from "./utils/contracts.js";
import { ScanApi } from "./utils/query.js";
import { AaveEarningAddress } from "./utils/constants.js";
import { saveJson } from "./utils/persistance.js";

const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_ETHEREUM_PROVIDER);
const polygonProvider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_POLYGON_PROVIDER);
const etherscanApi = new ScanApi("https://api.etherscan.io/api", process.env.ETHERSCAN_API_KEY);
const decoder = new InputDataDecoder("./abi.json");

let allocatedAssets = [];

const contracts = {
  "aUSDC": getContract("aUSDC", ethereumProvider),
  "aDAI": getContract("aDAI", ethereumProvider),
  "aUSDT": getContract("aUSDT", ethereumProvider),
  "aGUSD": getContract("aGUSD", ethereumProvider),
  "aBUSD": getContract("aBUSD", ethereumProvider),
  "aUST": getContract("aUST", polygonProvider),
}

const allTransactions = await Promise.all([
  etherscanApi.transactions(AaveEarningAddress),
  etherscanApi.transfers(AaveEarningAddress)
]).then(values => [...values[0], ...values[1]])
  .then(array => array.sort((a, b) => a.timeStamp - b.timeStamp));

const disabledTokens = [];
let currentWeek = "2021-31";
let currentTotalAssets = {
  "aUSDC": new BigNumber("0"),
  "aDAI": new BigNumber("0"),
  "aUSDT": new BigNumber("0"),
  "aGUSD": new BigNumber("0"),
  "aBUSD": new BigNumber("0"),
  "aUST": new BigNumber("0"),
}

let currentAllocatedAssets = {
  "aUSDC": new BigNumber("0"),
  "aDAI": new BigNumber("0"),
  "aUSDT": new BigNumber("0"),
  "aGUSD": new BigNumber("0"),
  "aBUSD": new BigNumber("0"),
  "aUST": new BigNumber("0"),
}

for (const t of allTransactions) {
  const date = DateTime.fromSeconds(parseInt(t.timeStamp, 10));
  const week = date.toFormat("kkkk-WW");

  if (week != currentWeek) {
    console.log(currentWeek);
    allocatedAssets.push({
      name: currentWeek,
      aUSDC: currentAllocatedAssets["aUSDC"].toNumber(),
      aDAI: currentAllocatedAssets["aDAI"].toNumber(),
      aUSDT: currentAllocatedAssets["aUSDT"].toNumber(),
      aGUSD: currentAllocatedAssets["aGUSD"].toNumber(),
      aBUSD: currentAllocatedAssets["aBUSD"].toNumber(),
    });
    currentWeek = week;
  }

  if (t.tokenSymbol) {
    if (t.tokenSymbol.indexOf("a") == 0 && disabledTokens.indexOf(t.tokenSymbol) == -1) {

      let divisor = new BigNumber(10).pow(t.tokenDecimal);
      let value = new BigNumber(t.value).dividedBy(divisor);
      if (t.from == AaveEarningAddress) {
        value = value.multipliedBy(-1);
      }

      let totalValue = await contracts[t.tokenSymbol].balanceOf(AaveEarningAddress, { blockTag: parseInt(t.blockNumber, 10) })
        .then(v => v.toString())
        .then(v => new BigNumber(v).dividedBy(divisor));

      if (!currentTotalAssets[t.tokenSymbol].isZero()) {
        let ratio = totalValue.minus(value).dividedBy(currentTotalAssets[t.tokenSymbol]);
        currentAllocatedAssets[t.tokenSymbol] = currentAllocatedAssets[t.tokenSymbol].multipliedBy(ratio);
      }

      console.log("transfer", totalValue.minus(currentTotalAssets[t.tokenSymbol]).toNumber(), t.tokenSymbol);
      currentTotalAssets[t.tokenSymbol] = totalValue;
    }
  }
  else {
    const decoded = decoder.decodeData(t.input);

    if (decoded.method == "updateBalances") {
      for (const input of decoded.inputs) {
        for (const balanceUpdate of input) {
          const amounts = balanceUpdate[0];
          if (!amounts[0].isZero() && disabledTokens.indexOf("aUSDC") == -1) await updateAllocated(t.blockNumber, "aUSDC", amounts[0].toString(), 6)
          if (!amounts[1].isZero() && disabledTokens.indexOf("aDAI") == -1) await updateAllocated(t.blockNumber, "aDAI", amounts[1].toString(), 18)
          if (!amounts[2].isZero() && disabledTokens.indexOf("aUSDT") == -1) await updateAllocated(t.blockNumber, "aUSDT", amounts[2].toString(), 6)
          if (!amounts[3].isZero() && disabledTokens.indexOf("aGUSD") == -1) await updateAllocated(t.blockNumber, "aGUSD", amounts[3].toString(), 2)
          if (!amounts[4].isZero() && disabledTokens.indexOf("aBUSD") == -1) await updateAllocated(t.blockNumber, "aBUSD", amounts[4].toString(), 18)
        }
      }
    }
    else if (decoded.method == "withdraw") {
      for (const amounts of decoded.inputs) {
        if (!amounts[0].isZero() && disabledTokens.indexOf("aUSDC") == -1) await updateAllocated(t.blockNumber, "aUSDC", "-" + amounts[0].toString(), 6)
        if (!amounts[1].isZero() && disabledTokens.indexOf("aDAI") == -1) await updateAllocated(t.blockNumber, "aDAI", "-" + amounts[1].toString(), 18)
        if (!amounts[2].isZero() && disabledTokens.indexOf("aUSDT") == -1) await updateAllocated(t.blockNumber, "aUSDT", "-" + amounts[2].toString(), 6)
        if (!amounts[3].isZero() && disabledTokens.indexOf("aGUSD") == -1) await updateAllocated(t.blockNumber, "aGUSD", "-" + amounts[3].toString(), 2)
        if (!amounts[4].isZero() && disabledTokens.indexOf("aBUSD") == -1) await updateAllocated(t.blockNumber, "aBUSD", "-" + amounts[4].toString(), 18)
      }
    }
    else if (decoded.method != null) {
      console.warn(decoded.method, t.hash);
    }
  }
}

allocatedAssets.push({
  name: currentWeek,
  aUSDC: currentAllocatedAssets["aUSDC"].toNumber(),
  aDAI: currentAllocatedAssets["aDAI"].toNumber(),
  aUSDT: currentAllocatedAssets["aUSDT"].toNumber(),
  aGUSD: currentAllocatedAssets["aGUSD"].toNumber(),
  aBUSD: currentAllocatedAssets["aBUSD"].toNumber(),
});

await saveJson(allocatedAssets, "../public/data/allocated.json")

async function updateAllocated(blockNumber, symbol, amount, decimals) {
  let divisor = new BigNumber(10).pow(decimals);
  let value = new BigNumber(amount).dividedBy(new BigNumber(10).pow(6));
  let totalValue = await contracts[symbol].balanceOf(AaveEarningAddress, { blockTag: parseInt(blockNumber, 10) })
    .then(v => v.toString())
    .then(v => new BigNumber(v).dividedBy(divisor));
  const ratio = totalValue.dividedBy(currentTotalAssets[symbol]);
  const newValue = currentAllocatedAssets[symbol].multipliedBy(ratio).plus(value);
  console.log("allocate", newValue.minus(currentAllocatedAssets[symbol]).toNumber(), symbol);
  currentAllocatedAssets[symbol] = newValue;
  currentTotalAssets[symbol] = totalValue;
}