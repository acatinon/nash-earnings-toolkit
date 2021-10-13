<script lang="typescript">
  import type { ethers } from "ethers";
  import { web3, Web3Provider } from "./utils/web3";
  import { EarningContract } from "./utils/contract";
  import { USDC_DECIMALS, DAI_DECIMALS, USDT_DECIMALS, GUSD_DECIMALS, BUSD_DECIMALS } from "./utils/constants";

  import Decimal from "./components/Decimal.svelte"; 

  const web3Provider = web3();
  let ethersProvider: ethers.providers.Web3Provider | null;
  let isConnected = false;

  const connect = () => {
    web3Provider.connect();
  };

  let onConnected = new Promise<[EarningContract, string]>((resolve, reject) => {
    web3Provider.subscribe(async (ethersProvider: Web3Provider) => {
      if (ethersProvider.isConnected && ethersProvider.provider) {
        let accounts = await ethersProvider.provider.listAccounts();
        let account = accounts[0];
        resolve([
          new EarningContract(await $web3Provider.provider!.getSigner(account)),
          account
        ]);
      }
    });
  });


</script>

{#await onConnected}
  <button class="m-auto block" on:click={connect}>Connect your wallet</button>
{:then [contract, account]}
  <p>Connected with {account}</p>
  {#await contract.balanceOf(account)}
    <p>Get balances</p>
  {:then balances}
    <table>
      <tr>
        <td>USDC</td>
        <td><Decimal value={balances.usdc} decimals={USDC_DECIMALS} /></td>
        <td></td>
      </tr>
      <tr>
        <td>DAI</td>
        <td><Decimal value={balances.dai} decimals={DAI_DECIMALS} /></td>
        <td></td>
      </tr>
      <tr>
        <td>USDT</td>
        <td><Decimal value={balances.usdt} decimals={USDT_DECIMALS} /></td>
        <td></td>
      </tr>
      <tr>
        <td>GUSD</td>
        <td><Decimal value={balances.gusd} decimals={GUSD_DECIMALS} /></td>
        <td></td>
      </tr>
      <tr>
        <td>BUSD</td>
        <td><Decimal value={balances.busd} decimals={BUSD_DECIMALS} /></td>
        <td></td>
      </tr>
    </table>
  {/await}
{/await}
