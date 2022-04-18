import { ethers } from "ethers";
import { ContractAddresses, AaveEarningAddress, ABIs } from "./constants.js";
import earningAaveAbi from "../ABIs/earningAave.json" assert { type: 'json' };

export function getContractFromToken(token, provider): ethers.Contract {
  return new ethers.Contract(ContractAddresses[token], ABIs[token], provider);
}

export function getAaveEarningContract(provider): ethers.Contract {
  return new ethers.Contract(AaveEarningAddress, earningAaveAbi, provider);
}