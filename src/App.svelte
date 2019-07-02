<script>
  import { state } from './stores.js';
  import Steps from './components/Steps.svelte';
  import ProviderPicker from './components/ProviderPicker.svelte';
  import MangaPicker from './components/MangaPicker.svelte';
  import SettingsPicker from './components/SettingsPicker.svelte';
  $: loaderClass = $state.loading ? "ui active loader" : "ui loader";
</script>

<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="app">
  <Steps />
  <div class={loaderClass}>
  </div>
  {#if $state.currentStep === 1}
    <ProviderPicker/>
  {:else if $state.currentStep === 2}
    <MangaPicker/>
  {:else if $state.currentStep === 3}
    <SettingsPicker/>
  {/if}
  
</div>