<script>
  import { onMount } from 'svelte';
  import { state } from "../stores.js";

  ipcRenderer.on('gotMangaChapterList', (event, arg) => {
    console.log(arg);
    state.set({ ...$state, minChapter: arg[0], maxChapter: arg[arg.length - 1], currentStep: 3, loading: false });
  })

  function pickManga(manga) {
    state.set({ ...$state, manga: manga, loading: true });
    ipcRenderer.send('getMangaChapterList', manga);
  }

  onMount(() => {
    jQuery('.ui.search')
      .search({
        source: $state.mangaList,
        onSelect: pickManga
      })
  });
</script>

<style>
</style>

<div class="ui search">
  <div class="ui icon input">
    <input class="prompt" type="text" placeholder="Pick a manga">
    <i class="search icon"></i>
  </div>
  <div class="results"></div>
</div>