import { ethers } from "hardhat";
import { expect } from "chai";

import abi from "../src/utils/abi.json";


describe("Balance of", function () {
  it("Check the balance", async function () {
    let contract = await ethers.getContractAt(abi, "0x774073229CD5839F38F60f2B98Be3C99dAC9AD21");

    const balanceOf = await contract.balanceOf("0xcd5B05c5675857e52F18e4DaEb7c8d0FE98dE524");

    for (let b of balanceOf)
    {
        console.log(b.toString());
    }
    
    //expect(manualWithdrawlFee.toString()).to.equal("100");
  });
});