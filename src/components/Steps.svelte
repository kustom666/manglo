<script>
  import { state } from "../stores.js";
  $: isActive = (stepIndex) => {
    return $state.currentStep === stepIndex ? "active step" : $state.currentStep > stepIndex ? "completed step" : "step";
  }
  function setActive(stepIndex) {
    state.set({ ...$state, currentStep: stepIndex });
  }
</script>

<style>
  .top-sticky {
    width: 100%;
    position: fixed;
    top: 0;
  }

  .steps {
    width: 100%;
  }

  .step {
    cursor: pointer;
  }
</style>

<div class="top-sticky">
  <div class="ui steps">
    <div on:click={()=> setActive(1)} class={isActive(1)}>
      <i class="columns icon"></i>
      <div class="content">
        <div class="title">Provider</div>
        <div class="description">Choose which website to use</div>
      </div>
    </div>
    <div on:click={()=> setActive(2)} class={isActive(2)}>
      <i class="search icon"></i>
      <div class="content">
        <div class="title">Manga</div>
        <div class="description">Find the manga you want</div>
      </div>
    </div>
    <div on:click={()=>setActive(3)} class={isActive(3)}>
      <i class="book icon"></i>
      <div class="content">
        <div class="title">Settings</div>
        <div class="description">Turn it into a kindle book</div>
      </div>
    </div>
  </div>
</div>