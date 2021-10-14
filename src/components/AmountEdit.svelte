<script lang="typescript">
  import type BigNumber from "bignumber.js";

  export let value: BigNumber;

  let visible = value.gt(0);
</script>

{#if visible}
  <input /> <a href="#">Max</a>
{/if}
