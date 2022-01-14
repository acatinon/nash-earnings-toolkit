import { ethers } from "hardhat";
import { expect } from "chai";

import abi from "../src/abi.json";


describe("Manual withdrawal fees", function () {
  it("The withdrawal fees should be 1%", async function () {
    let contract = await ethers.getContractAt(abi, "0x774073229CD5839F38F60f2B98Be3C99dAC9AD21");

    const manualWithdrawlFee = await contract.manualWithdrawalFee()

    expect(manualWithdrawlFee.toString()).to.equal("100");
  });
});