import aUsdcAbi from "../ABIs/aUSDC.json" assert { type: 'json' };
import aDaiAbi from "../ABIs/aDAI.json" assert { type: 'json' };
import aUsdtAbi from "../ABIs/aUSDT.json" assert { type: 'json' };
import aGusdAbi from "../ABIs/aGUSD.json" assert { type: 'json' };
import aBusdAbi from "../ABIs/aBUSD.json" assert { type: 'json' };
import aUstAbi from "../ABIs/aUST.json" assert { type: 'json' };

export const ContractAddresses = {
  aUSDC: "0xBcca60bB61934080951369a648Fb03DF4F96263C",
  aDAI: "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
  aUSDT: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
  aGUSD: "0xD37EE7e4f452C6638c96536e68090De8cBcdb583",
  aBUSD: "0xA361718326c15715591c299427c62086F69923D9",
  aUST: "0x522a3Bd54d5D6a9CC67592e31Cc1A745630daF50"
}

export const ABIs = {
  aUSDC: aUsdcAbi,
  aDAI: aDaiAbi,
  aUSDT: aUsdtAbi,
  aGUSD: aGusdAbi,
  aBUSD: aBusdAbi,
  aUST: aUstAbi
}

export const AaveEarningAddress = "0x774073229cd5839f38f60f2b98be3c99dac9ad21";
export const AnchorEarningAddress = "0x70fa3ce2e0c8c20d9f89fe745089149fb3abc623";
export const EthereumSwapFeesAddress = "0x6E86f9084f7348071b4105Da13e9967617BC65aD";