<script lang="typescript">
  import type { ethers } from "ethers";
  import { web3 } from "./utils/web3";
  import { EarningContract, Balances } from "./utils/contract";

  const web3Provider = web3();
  let isConnected = false;
  let earningContract: EarningContract | null = null;
  let balances: Balances | null = null;

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
    let accounts = await ethersProvider.listAccounts();
    let account = accounts[0];
    earningContract = new EarningContract(ethersProvider.getSigner(account));
    balances = await earningContract.balanceOf(account);

    console.log(account);
    console.log(balances);

    isConnected = $web3Provider.isConnected;
  };
</script>

{#if isConnected}
  <p>Connected</p>
{:else}
  <button class="m-auto block" on:click={connect}>Connect your wallet</button>
{/if}
