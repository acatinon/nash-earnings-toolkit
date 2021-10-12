<script lang="typescript">
  import { web3 } from "./utils/web3";
  import type { ethers } from "ethers";

  const web3Provider = web3();

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
  }

</script>

<button class="m-auto block" on:click={connect}>Connect your wallet</button>