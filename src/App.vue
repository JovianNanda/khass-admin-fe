<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useColors } from 'vuestic-ui'

const { applyPreset } = useColors()

// set theme from local storage or use light theme if there is no theme in local storage
const theme = localStorage.getItem('app-theme') || 'light'
applyPreset(theme)
</script>

<style lang="scss">
@import 'scss/main.scss';

#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 20rem;
}

/* Custom scrollbar */
/* Width */
::-webkit-scrollbar {
  width: 10px;
  /* For Chrome, Safari, and Opera */
}

::-moz-scrollbar {
  width: 10px;
  /* For Firefox */
}

::-ms-scrollbar {
  width: 10px;
  /* For Microsoft Edge */
}

:root {
  --scrollbar-width: thin;
  /* For Chrome, Safari, and Opera */
  scrollbar-width: thin;
  /* For Firefox */
}

/* Track */
::-webkit-scrollbar-track {
  background: #696969;
  /* Color of the track */
}

::-moz-scrollbar-track {
  background: #696969;
  /* Color of the track */
}

::-ms-scrollbar-track {
  background: #696969;
  /* Color of the track */
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(0, 50, 186);
  /* Color of the scroll thumb */
  border-radius: 10px;
  /* Rounded corners */
}

::-moz-scrollbar-thumb {
  background: rgb(0, 50, 186);
  /* Color of the scroll thumb */
  border-radius: 10px;
  /* Rounded corners */
}

::-ms-scrollbar-thumb {
  background: rgb(0, 50, 186);
  /* Color of the scroll thumb */
  border-radius: 10px;
  /* Rounded corners */
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(0, 68, 255);
  /* Color of the scroll thumb on hover */
}

::-moz-scrollbar-thumb:hover {
  background: rgb(0, 68, 255);
  /* Color of the scroll thumb on hover */
}

::-ms-scrollbar-thumb:hover {
  background: rgb(0, 68, 255);
  /* Color of the scroll thumb on hover */
}
</style>
