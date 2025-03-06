<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-tag text-secondary font-bold uppercase">Daily Transactions</h1>
    </VaCardTitle>
    <VaCardContent>
      <div class="p-1 bg-black rounded absolute right-4 top-4">
        <VaIcon name="mso-attach_money" color="#fff" size="large" />
      </div>
      <section>
        <!-- <div class="text-xl font-bold mb-2">$6,820</div> -->
        <!-- <p class="text-xs text-success">
          <VaIcon name="arrow_upward" />
          25.36%
          <span class="text-secondary"> last month</span>
        </p> -->
      </section>
      <div class="w-full h-60 flex items-center">
        <VaChart :data="chartDataVal" class="h-24" type="line" :options="options" />
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { VaCard } from 'vuestic-ui'
import VaChart from '../../../../components/va-charts/VaChart.vue'
import { useChartData } from '../../../../data/charts/composables/useChartData'
// import { lineChartData } from '../../../../data/charts/lineChartData'
import { ChartOptions } from 'chart.js'
import { ChartData } from '../../../../types/dashboard'
import { TLineChartData } from '../../../../data/types'

const props = defineProps<{
  chartData: ChartData[]
}>()

const lineChartData: TLineChartData = {
  labels: props.chartData.map((data) => data.date),
  datasets: [
    {
      label: 'Total Transactions',
      backgroundColor: 'rgba(75,192,192,0.4)',
      data: props.chartData.map((data) => data.total),
    },
  ],
}

const chartDataVal = useChartData(lineChartData)

const options: ChartOptions<'line'> = {
  scales: {
    x: {
      display: true,
      grid: {
        display: false, // Disable X-axis grid lines ("net")
      },
    },
    y: {
      display: true,
      grid: {
        display: false, // Disable Y-axis grid lines ("net")
      },
      ticks: {
        display: true, // Hide Y-axis values
      },
      beginAtZero: true,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
}
</script>
