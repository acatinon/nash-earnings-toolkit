import "dotenv/config";
import { ethers } from "ethers";
import { DateTime } from "luxon";
import BigNumber from "bignumber.js";
import EthDater from "ethereum-block-by-date";
import InputDataDecoder from "ethereum-input-data-decoder";
import { getAaveEarningContract } from "./utils/contracts.js";
import { ScanApi } from "./utils/query.js";
import { AaveEarningAddress } from "./utils/constants.js";
import { saveJson } from "./utils/persistance.js";

const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_ETHEREUM_PROVIDER);
const polygonProvider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_POLYGON_PROVIDER);
const etherscanApi = new ScanApi("https://api.etherscan.io/api", process.env.ETHERSCAN_API_KEY);
const decoder = new InputDataDecoder("./ABIs/earningAave.json");
const ethereumDater = new EthDater(ethereumProvider);

const aaveEarningContract = getAaveEarningContract(ethereumProvider);
const transactions = await etherscanApi.transactions(AaveEarningAddress);

let allocatedAssets = [];
const addressesByWeeks = {};
let allAddresses = {};


for (const t of transactions) {
  let date = DateTime.fromSeconds(parseInt(t.timeStamp, 10));
  let week = date.toFormat("kkkk-WW");

  addressesByWeeks[week] = addressesByWeeks[week] || {};

  const decoded = decoder.decodeData(t.input);

  if (decoded.method == "updateBalances") {
    for (const balanceUpdate of decoded.inputs[0]) {
      addressesByWeeks[week][balanceUpdate[4]] = true;
    }
  }
}

let blocksEveryWeeks = await ethereumDater.getEvery(
  'weeks',
  '2021-08-09T00:00:00Z',
  DateTime.now().toISO(),
  1,
  false
);

for (const b of blocksEveryWeeks) {
  const date = DateTime.fromSeconds(b.timestamp);
  const week = date.toFormat("kkkk-WW");
  let promises = [];
  const assets = { name: week };

  console.log(week);

  allAddresses = { ...allAddresses, ...addressesByWeeks[week] }

  for (const address of Object.keys(allAddresses)) {
    promises.push(balanceOf(address, b.block))
  }

  const allBalances = await Promise.all(promises);

  const allBalanceSums = allBalances.reduce((previousValue, currentValue) => {
    previousValue["aUSDC"] = previousValue["aUSDC"].plus(currentValue["aUSDC"]);
    previousValue["aDAI"] = previousValue["aDAI"].plus(currentValue["aDAI"]);
    previousValue["aUSDT"] = previousValue["aUSDT"].plus(currentValue["aUSDT"]);
    previousValue["aGUSD"] = previousValue["aGUSD"].plus(currentValue["aGUSD"]);
    previousValue["aBUSD"] = previousValue["aBUSD"].plus(currentValue["aBUSD"]);
    return previousValue;
  },
    {
      "aUSDC": new BigNumber("0"),
      "aDAI": new BigNumber("0"),
      "aUSDT": new BigNumber("0"),
      "aGUSD": new BigNumber("0"),
      "aBUSD": new BigNumber("0")
    }
  );


  allocatedAssets.push({ ...assets, ...allBalanceSums })
}

await saveJson(allocatedAssets, "../public/data/allocated.json")


async function balanceOf(address, blockNumber) {
  const balances = await aaveEarningContract.balanceOf(address, { blockTag: blockNumber });
  return {
    "aUSDC": new BigNumber(balances[0].toString()).dividedBy(new BigNumber(10).pow(6)),
    "aDAI": new BigNumber(balances[1].toString()).dividedBy(new BigNumber(10).pow(6)),
    "aUSDT": new BigNumber(balances[2].toString()).dividedBy(new BigNumber(10).pow(6)),
    "aGUSD": new BigNumber(balances[3].toString()).dividedBy(new BigNumber(10).pow(6)),
    "aBUSD": new BigNumber(balances[4].toString()).dividedBy(new BigNumber(10).pow(6)),
  };
}
