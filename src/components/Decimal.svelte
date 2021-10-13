<script lang="typescript">
  import type BigNumber from "bignumber.js";

  export let value: BigNumber | undefined;
  export let decimals: number;

  let formatted = "";
  
  if (value) {
    formatted = value.dividedBy(Math.pow(10, decimals)).toFormat(6);
  }
</script>

<span>{formatted}</span>