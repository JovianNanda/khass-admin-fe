<script lang="ts" setup>
import { watch } from 'vue'
import DailyEarning from './cards/DailyEarnings.vue'
import CardItem from './CardItem.vue'
import { useDashboardStore } from '../../../stores/dashboard'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { getSummary, getChartData } = useDashboardStore()
const { chartData, summary } = storeToRefs(useDashboardStore())

const updateChartKey = ref(0)

getSummary()
getChartData()

watch(chartData, () => {
  // Perform rerender logic here
  updateChartKey.value++
})
</script>

<template>
  <h1 class="page-title font-bold">Dashboard</h1>
  <section class="flex flex-col gap-4">
    <!-- <DataSection /> -->
    <div class="flex flex-wrap gap-4">
      <CardItem
        v-for="(dataSummry, i) in summary"
        :key="i"
        :title="dataSummry.bundle_name"
        :value="dataSummry.total_participants"
        class="w-[200px]"
      />
    </div>
    <DailyEarning :key="updateChartKey" :chart-data="chartData" class="w-full h-100" />
  </section>
</template>
