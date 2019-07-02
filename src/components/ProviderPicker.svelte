<script>
  import { state } from "../stores.js";
  const ipcRenderer = window.ipcRenderer;

  $: submitClasses = $state.loading ? "ui bottom attached button primary loading disabled" : "ui bottom attached button primary";

  ipcRenderer.on('gotMangaList', (event, arg) => {
    state.set({ ...$state, mangaList: arg, currentStep: 2, loading: false });
  })

  function pickProvider(providerName) {
    state.set({ ...$state, provider: providerName, loading: true });
    ipcRenderer.send('getMangaList');
  }
</script>

<style>
</style>

<div class="ui card">
  <div class="content">
    <a class="header">Mangapanda</a>
    <div class="meta">
      <a href="https://mangapanda.com">https://mangapanda.com</a>
    </div>
    <div class="description">
      Mangapanda is one of the main players of online scans
    </div>
  </div>
  <div class={submitClasses} on:click={()=> pickProvider("mangapanda")}>Use Mangapanda as a provider
  </div>
</div>