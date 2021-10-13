
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import abi from "./abi.json";

const USDC_DECIMALS = 6;
const DAI_DECIMALS = 18;
const USDT_DECIMALS = 6;
const GUSD_DECIMALS = 6;
const BUSD_DECIMALS = 18;

export class EarningContract {
  protected ethersContract: ethers.Contract;

  constructor(signer: ethers.providers.JsonRpcSigner) {
    this.ethersContract = new ethers.Contract("0x774073229CD5839F38F60f2B98Be3C99dAC9AD21", abi, signer);
  }

  public async balanceOf(account: string): Promise<Balances> {
    const balances = await this.ethersContract.balanceOf(account);

    return this.arrayToBalances(balances);
  }

  public async calcAmounts(inputBalances: Balances): Promise<Balances> {
    const balances = await this.ethersContract.calcAmounts(this.balancesToArray(inputBalances));

    return this.arrayToBalances(balances);
  }

  public async calcPrincipalAmounts(inputBalances: Balances): Promise<Balances> {
    const balances = await this.ethersContract.calcPrincipalAmounts(this.balancesToArray(inputBalances));

    return this.arrayToBalances(balances);
  }


  public async tokens(index: number): Promise<string> {
    const address = await this.ethersContract.tokens(index);

    return address;
  }

  public async manualWithdrawalFee(): Promise<BigNumber> {
    const fee = await this.ethersContract.manualWithdrawalFee();

    return new BigNumber(fee.toString()).dividedBy(100);
  }

  public async getUserNonce(account: string): Promise<BigNumber> {
    const nonce = await this.ethersContract.getUserNonce(account);

    return new BigNumber(nonce.toString());
  }

  public async ledgerBalanceScale(): Promise<BigNumber> {
    const scale = await this.ethersContract.ledgerBalanceScale();

    return new BigNumber(scale.toString());
  }

  public async withdraw(balances: Balances): Promise<void> {
    console.log("withdraw");
    await this.ethersContract.withdraw(this.balancesToArray(balances));
  }

  balancesToArray(balances: Balances): string[] {
    return [
      balances.usdc.multipliedBy(Math.pow(10, USDC_DECIMALS)).toString(),
      balances.dai.multipliedBy(Math.pow(10, DAI_DECIMALS)).toString(),
      balances.usdt.multipliedBy(Math.pow(10, USDT_DECIMALS)).toString(),
      balances.gusd.multipliedBy(Math.pow(10, GUSD_DECIMALS)).toString(),
      balances.busd.multipliedBy(Math.pow(10, BUSD_DECIMALS)).toString(),
    ];
  }

  arrayToBalances(balances: any[]): Balances {
    return {
      usdc: new BigNumber(balances[0].toString()).dividedBy(Math.pow(10, USDC_DECIMALS)),
      dai: new BigNumber(balances[1].toString()).dividedBy(Math.pow(10, DAI_DECIMALS)),
      usdt: new BigNumber(balances[2].toString()).dividedBy(Math.pow(10, USDT_DECIMALS)),
      gusd: new BigNumber(balances[3].toString()).dividedBy(Math.pow(10, GUSD_DECIMALS)),
      busd: new BigNumber(balances[4].toString()).dividedBy(Math.pow(10, BUSD_DECIMALS)),
    };
  }
}

export class Balances {
  public usdc: BigNumber;
  public dai: BigNumber;
  public usdt: BigNumber;
  public gusd: BigNumber;
  public busd: BigNumber;

  public constructor() {
    this.usdc = new BigNumber("0");
    this.dai = new BigNumber("0");
    this.usdt = new BigNumber("0");
    this.gusd = new BigNumber("0");
    this.busd = new BigNumber("0");
  }

  public static zero(): Balances {
    return {
      usdc: new BigNumber("0"),
      dai: new BigNumber("0"),
      usdt: new BigNumber("0"),
      gusd: new BigNumber("0"),
      busd: new BigNumber("0")
    }
  }

  public static fromString(usdc: string, dai: string, usdt: string, gusd: string, busd: string) {
    return {
      usdc: new BigNumber(usdc),
      dai: new BigNumber(dai),
      usdt: new BigNumber(usdt),
      gusd: new BigNumber(gusd),
      busd: new BigNumber(busd)
    }
  }
}