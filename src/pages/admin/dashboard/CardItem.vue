<script setup lang="ts">
const props = defineProps<{
  title: string
  value: string | number
}>()
</script>

<template>
  <VaCard color="primary" gradient>
    <VaCardTitle>{{ props.title }}</VaCardTitle>
    <VaCardContent>
      <b class="text-xl">{{ props.value }}</b> participants
    </VaCardContent>
  </VaCard>
</template>
