<script lang="typescript">
  import type { ethers } from "ethers";
  import { web3, Web3Provider } from "./utils/web3";
  import { EarningContract, Balances } from "./utils/contract";

  import Decimal from "./components/Decimal.svelte";

  const web3Provider = web3();
  let ethersProvider: ethers.providers.Web3Provider | null;
  let isConnected = false;

  const connect = () => {
    web3Provider.connect();
  };

  const withdraw = async (contract: EarningContract, balances: Balances) => {};

  let onConnected = new Promise<[EarningContract, string]>((resolve, reject) => {
    web3Provider.subscribe(async (ethersProvider: Web3Provider) => {
      if (ethersProvider.isConnected && ethersProvider.provider) {
        let accounts = await ethersProvider.provider.listAccounts();
        let account = accounts[0];
        resolve([new EarningContract(await $web3Provider.provider!.getSigner(account)), account]);
      }
    });
  });
</script>

{#await onConnected}
  <button class="m-auto block" on:click={connect}>Connect your wallet</button>
{:then [contract, account]}
  <p>Connected with {account}</p>
  {#await contract.balanceOf(account) then balances}
    <table>
      <tr>
        <td>USDC</td>
        <td><Decimal value={balances.usdc} /></td>
        <td />
      </tr>
      <tr>
        <td>DAI</td>
        <td><Decimal value={balances.dai} /></td>
        <td />
      </tr>
      <tr>
        <td>USDT</td>
        <td><Decimal value={balances.usdt} /></td>
        <td />
      </tr>
      <tr>
        <td>GUSD</td>
        <td><Decimal value={balances.gusd} /></td>
        <td />
      </tr>
      <tr>
        <td>BUSD</td>
        <td><Decimal value={balances.busd} /></td>
        <td />
      </tr>
    </table>
    <div>
      <button on:click={(e) => contract.withdraw(balances)}>Withdraw</button>
    </div>
  {/await}
{/await}
