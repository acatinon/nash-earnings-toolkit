import { ethers } from "ethers";
import { ContractAddresses, ABIs } from "./constants.js";

export function getContract(token, provider): ethers.Contract {
  return new ethers.Contract(ContractAddresses[token], ABIs[token], provider);
}