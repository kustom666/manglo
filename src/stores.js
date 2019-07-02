import { writable } from 'svelte/store';

export const state = writable({
    provider: '',
    manga: {},
    mangaList: [],
    minChapter: '',
    maxChapter: '',
    startChapter: '',
    endChapter: '',
    currentStep: 1,
    loading: false,
    errorMessage: ''
})