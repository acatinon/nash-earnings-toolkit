<script lang="typescript">
  import type BigNumber from "bignumber.js";
  import AutoNumeric from "autonumeric";
  import { onMount } from 'svelte';

  export let maxValue: BigNumber;
  export let decimalPlaces: number;

  let numericInput: HTMLInputElement;
  let numericValue = "0";
  let visible = maxValue.gt(0);

  onMount(() => {
    if (visible) {
      new AutoNumeric(numericInput, null, {
        decimalPlaces: decimalPlaces,
        maximumValue: maxValue.toString(),
        selectOnFocus: false
      });
    }
  });

  const setMax = () => {
    //@ts-ignore
    AutoNumeric.set(numericInput, maxValue.toString());
  };

</script>

{#if visible}
  <input bind:this={numericInput} bind:value={numericValue} /> <a on:click={setMax} href="#">Max</a>
{/if}
