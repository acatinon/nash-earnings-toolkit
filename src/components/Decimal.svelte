<script lang="typescript">
  import type BigNumber from "bignumber.js";

  export let value: BigNumber | undefined;

  let formatted = "";

  if (value) {
    formatted = value.toFormat(6);
  }
</script>

<span class="tabular-nums">{formatted}</span>
