import { defineStore } from 'pinia'

import service from '../services/http-common'
import { useToast } from 'vuestic-ui/web-components'

import { Summary, ChartData } from '../types/dashboard'
import { responseAPI } from '../types/responseAPI'

const { init } = useToast()

export const useDashboardStore = defineStore('dashboard', {
  state: () => {
    return {
      summary: [] as Summary[],
      chartData: [] as ChartData[],
    }
  },
  getters: {},
  actions: {
    async getSummary() {
      try {
        const result: responseAPI & { data: Summary[] } = await service.get('/admin/dashboard/summary')

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }

        this.summary = result.data
      } catch (error: any) {
        init({ message: error.message, color: 'danger' })
        console.log(error)
      }
    },
    async getChartData() {
      try {
        const result: responseAPI & { data: ChartData[] } = await service.get('/admin/dashboard/chart')

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }

        this.chartData = result.data
      } catch (error: any) {
        init({ message: error.message, color: 'danger' })
        console.log(error)
      }
    },
  },
})
