
import "dotenv/config";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { DateTime } from "luxon";
import InputDataDecoder from "ethereum-input-data-decoder";
import { ScanApi } from "./utils/query.js";
import { saveJson } from "./utils/persistance.js";

const startBlock = "12951552";
const aaveEarningAddress = "0x774073229cd5839f38f60f2b98be3c99dac9ad21";
const anchorEarningAddress = "0x70fa3ce2e0c8c20d9f89fe745089149fb3abc623";

let totalAssets = {};

let allocatedAssets = {
  "aUSDC": { "2021-08-03": new BigNumber("0") },
  "aDAI": { "2021-08-03": new BigNumber("0") },
  "aUSDT": { "2021-08-03": new BigNumber("0") },
  "aGUSD": { "2021-08-03": new BigNumber("0") },
  "aBUSD": { "2021-08-03": new BigNumber("0") },
  "aUST": { "2021-08-03": new BigNumber("0") },
}

const etherscanApi = new ScanApi("https://api.etherscan.io/api", process.env.ETHERSCAN_API_KEY);
const polygonscanApi = new ScanApi("https://api.polygonscan.com/api", process.env.POLYGONSCAN_API_KEY);

function update(dict, timeStamp, symbol, value) {
  let date = DateTime.fromSeconds(timeStamp).toFormat("yyyy-WW");
  let assets = dict[date] || {};
  let v = assets[symbol] || new BigNumber(0);
  v = v.plus(value);
  assets[symbol] = v;

  dict[date] = assets;
}

function prepareSerialization(assets) {
  let sums = {
    "aUSDC": new BigNumber("0"),
    "aDAI": new BigNumber("0"),
    "aUSDT": new BigNumber("0"),
    "aGUSD": new BigNumber("0"),
    "aBUSD": new BigNumber("0"),
    "aUST": new BigNumber("0")
  }
  let toReturn = [];
  for (const date in assets) {
    const serie = { name: date };
    for (const asset in assets[date]) {
      sums[asset] = sums[asset].plus(assets[date][asset]);
      serie[asset] = sums[asset].toNumber();
    }

    toReturn.push(serie);
  }

  return toReturn;
}

function getTransfersFunction(earningAddress: string) {
  return (json) => {
    for (const transaction of json.result) {
      if (transaction.tokenSymbol.indexOf("a") == 0) {
        const timeStamp = parseInt(transaction.timeStamp);
        let decimals = new BigNumber(10).pow(transaction.tokenDecimal);
        let value = new BigNumber(transaction.value).dividedBy(decimals);
        if (transaction.from == earningAddress) {
          value = value.multipliedBy(-1);
        }
        update(totalAssets, timeStamp, transaction.tokenSymbol, value);
      }
    }
  };
}

await etherscanApi.transfers(aaveEarningAddress).then(getTransfersFunction(aaveEarningAddress));
await polygonscanApi.transfers(anchorEarningAddress).then(getTransfersFunction(anchorEarningAddress));
await saveJson(prepareSerialization(totalAssets), "../public/data/earning.json")

const decoder = new InputDataDecoder("./abi.json");

/*
polygonscanApi.contractEvents(anchorEarningAddress).then((json: any) => {

  for (const transaction of json.result) {
    const dateTime = DateTime.fromSeconds(parseInt(transaction.timeStamp));
    const decoded = decoder.decodeData(transaction.input);
    console.log(decoded);
    if (decoded.method == "updateBalances") {
      for (const input of decoded.inputs) {
        for (const balanceUpdate of input) {
          const amounts = balanceUpdate[0];

          if (!amounts[0].isZero()) updateAllocated(dateTime, "aUSDC", amounts[0].toString())
          if (!amounts[1].isZero()) updateAllocated(dateTime, "aDAI", amounts[1].toString())
          if (!amounts[2].isZero()) updateAllocated(dateTime, "aUSDT", amounts[2].toString())
          if (!amounts[3].isZero()) updateAllocated(dateTime, "aGUSD", amounts[3].toString())
          if (!amounts[4].isZero()) updateAllocated(dateTime, "aBUSD", amounts[4].toString())
        }
      }
    }
  }
  let serialized = prepareSerialization(allocatedAssets);
  console.log(serialized);
});
*/

function handleInputs(input, tupleArray = false) {
  if (input instanceof Object && input.components) {
    input = input.components
  }

  if (!Array.isArray(input)) {
    if (input instanceof Object && input.type) {
      return input.type
    }

    return input
  }

  let ret = '(' + input.reduce((acc, x) => {
    if (x.type === 'tuple') {
      acc.push(handleInputs(x.components))
    } else if (x.type === 'tuple[]') {
      acc.push(handleInputs(x.components) + '[]')
    } else {
      acc.push(x.type)
    }
    return acc
  }, []).join(',') + ')'

  if (tupleArray) {
    return ret + '[]'
  }

  return ret
}

function genMethodId(methodName, types) {
  const input = methodName + '(' + (types.reduce((acc, x) => {
    acc.push(handleInputs(x, x.type === 'tuple[]'))
    return acc
  }, []).join(',')) + ')'

  return ethers.utils.keccak256(Buffer.from(input)).slice(2, 10)
}


let inputs = [
  {
    "components": [
      {
        "internalType": "int256[5]",
        "name": "deltas",
        "type": "int256[5}"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
    ],
    "internalType": "struct BalanceUpdate[]",
    "name": "updates",
    "type": "tuple[]"
  }
]

let first = "(address,int256)[]"
let second = "(bytes32,bytes32,uint8)"
let input = `updateBalance((${first},${second}))`;
let hash = ethers.utils.keccak256(Buffer.from(input)).slice(2, 10);

// 0xe544609e
//console.log(hash);