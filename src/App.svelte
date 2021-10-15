<script lang="typescript">
  import type { ethers } from "ethers";
  import { web3, Web3Provider } from "./utils/web3";
  import { EarningContract, Balances, USDC_DECIMALS, DAI_DECIMALS, USDT_DECIMALS, GUSD_DECIMALS, BUSD_DECIMALS } from "./utils/contract";

  import Decimal from "./components/Decimal.svelte";
  import AmountEdit from "./components/AmountEdit.svelte";

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
      <thead>
        <tr>
          <th>Assets</th>
          <th>Holdings</th>
          <th>Withdraw</th>
        </tr>
      </thead>
      <tr>
        <td class="asset"><img src="img/usdc.png" alt="USDC" /> USDC</td>
        <td class="text-right"><Decimal value={balances.usdc} /></td>
        <td><AmountEdit maxValue={balances.usdc} decimalPlaces={USDC_DECIMALS} /></td>
      </tr>
      <tr>
        <td class="asset"><img src="img/dai.png" alt="USDC" /> DAI</td>
        <td class="text-right"><Decimal value={balances.dai} /></td>
        <td><AmountEdit maxValue={balances.dai} decimalPlaces={DAI_DECIMALS} /></td>
      </tr>
      <tr>
        <td class="asset"><img src="img/usdt.png" alt="USDC" /> USDT</td>
        <td class="text-right"><Decimal value={balances.usdt} /></td>
        <td><AmountEdit maxValue={balances.usdt} decimalPlaces={USDT_DECIMALS} /></td>
      </tr>
      <tr>
        <td class="asset"><img src="img/gusd.png" alt="USDC" /> GUSD</td>
        <td class="text-right"><Decimal value={balances.gusd} /></td>
        <td><AmountEdit maxValue={balances.gusd} decimalPlaces={GUSD_DECIMALS} /></td>
      </tr>
      <tr>
        <td class="asset"><img src="img/busd.png" alt="USDC" /> BUSD</td>
        <td class="text-right"><Decimal value={balances.busd} /></td>
        <td><AmountEdit maxValue={balances.busd} decimalPlaces={BUSD_DECIMALS} /></td>
      </tr>
      <tr>
        <td class="border-0"></td>
        <td class="border-0"></td>
        <td class="border-0 text-right"><button on:click={(e) => contract.withdraw(balances)}>Withdraw</button></td>
      </tr>
    </table>
    <div>
      
    </div>
  {/await}
{/await}
