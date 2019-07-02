<script>
  import { state } from "../stores.js";
  import { onMount } from 'svelte';
  const ipcRenderer = window.ipcRenderer;
  $: submitClasses = $state.loading ? "ui button primary loading disabled" : "ui button primary";

  ipcRenderer.on('downloadedManga', (event, arg) => {
    state.set({ ...$state, currentStep: 4, loading: false });
  })


  onMount(() => {
    console.log($state);
    let slider = document.getElementById('slider');
    noUiSlider.create(slider, {
      range: {
        'min': Number($state.minChapter),
        'max': Number($state.maxChapter)
      },
      start: [$state.minChapter, $state.maxChapter],
      step: 1,
      tooltips: false,
      connect: true,
      format: {
        to: (val) => {
          return parseInt(val);
        },
        from: (val) => {
          return Number(val);
        }
      }
    });

    slider.noUiSlider.on('update', (chapters) => {
      state.set({ ...$state, startChapter: chapters[0], endChapter: chapters[1] })
    });
  });

  function downloadManga() {
    let slider = document.getElementById('slider');
    let chapters = slider.noUiSlider.get();
    let chapterList = Array(Number(chapters[1]) - Number(chapters[0]) + 1).fill().map((_, idx) => `${Number(chapters[0]) + idx}`);
    state.set({ ...$state, loading: true });
    ipcRenderer.send('downloadManga', { manga: $state.manga, chapterList, destFolder: './downloads' });
  }
</script>

<style>
  .picker-form {
    width: 30%;
    padding: 2%;
    display: inline-block;
  }

  .inline-slider {
    display: flex;
    padding: 3rem 0 3rem 0;
  }

  .sliders {
    width: 100%;
    margin: 0 3rem 0 3rem;
  }

  .ui.toggle.checkbox input:checked~label::before {
    background-color: #3FB8AF !important;
  }
</style>

<div class="ui segment picker-form">
  <!-- <form class="ui form"> -->
  <div class="field">
    <label>Chapters to download</label>
    <div class="inline-slider">
      <span class="slider-value">{$state.startChapter}</span>
      <div id="slider" class="sliders"></div>
      <span class="slider-value">{$state.endChapter}</span>
    </div>
  </div>
  <div class="field">
    <div class="ui checkbox toggle">
      <input type="checkbox">
      <label>Convert to kindle format</label>
    </div>
  </div>
  <button class={submitClasses} on:click={downloadManga}>Download</button>
  <!-- </form> -->
</div>