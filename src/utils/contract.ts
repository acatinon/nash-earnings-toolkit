
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import abi from "./abi.json";

export class EarningContract {
    protected ethersContract: ethers.Contract;

    constructor(signer: ethers.providers.JsonRpcSigner) {
        this.ethersContract = new ethers.Contract("0x774073229CD5839F38F60f2B98Be3C99dAC9AD21", abi, signer);
    }

    public async balanceOf(account: string): Promise<Balances> {
        const balances = await this.ethersContract.balanceOf(account);

        return {
            usdc: new BigNumber(balances[0].toString()),
            dai: new BigNumber(balances[1].toString()),
            usdt: new BigNumber(balances[2].toString()),
            gusd: new BigNumber(balances[3].toString()),
            busd: new BigNumber(balances[4].toString()),
        };
    }

    public async tokens(index: number): Promise<string> {
        const address = await this.ethersContract.tokens(index);

        return address;
    }
}

export interface Balances {
    usdc: BigNumber,
    dai: BigNumber,
    usdt: BigNumber,
    gusd: BigNumber,
    busd: BigNumber
}