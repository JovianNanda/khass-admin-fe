<template>
  <VaButtonToggle v-model="theme" color="background-element" border-color="background-element" :options="options" />
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue'

import { useI18n } from 'vue-i18n'

import { useColors } from 'vuestic-ui'

const { applyPreset, currentPresetName } = useColors()

const theme = computed({
  get() {
    return currentPresetName.value
  },
  set(value) {
    applyPreset(value)
  },
})

watch(theme, (value) => {
  localStorage.setItem('app-theme', value)
})

const { t } = useI18n()

const options = [
  { label: t('buttonSelect.dark'), value: 'dark' },
  { label: t('buttonSelect.light'), value: 'light' },
]

// set theme from local storage
if (localStorage.getItem('app-theme')) {
  theme.value = localStorage.getItem('app-theme') as string
}
</script>
