import { defineStore } from 'pinia'

import service from '../services/http-common'
import { Attendance } from '../types/attendance'
import { responseAPI } from '../types/responseAPI'
import { useToast } from 'vuestic-ui/web-components'

const { init } = useToast()

export const useAttendancesStore = defineStore('attendance', {
  state: () => {
    return {
      attendances: [] as Attendance[],
      attendance: {} as Attendance,
      successScanMessage: '',
      successScanStatus: false,
      isLoading: false,
      search: '',
      searchByBundleName: [] as string[],
    }
  },
  getters: {
    getAttendances: (state) => () => {
      return (
        state.attendances?.filter((attendance) => {
          if (state.search === '' && state.searchByBundleName.length === 0) {
            return true
          }

          const searchText =
            attendance.name.toLowerCase().includes(state.search.toLowerCase()) ||
            attendance.identity_number.toLowerCase().includes(state.search.toLowerCase()) ||
            attendance.organization.toLowerCase().includes(state.search.toLowerCase())

          const searchByBundleName = state.searchByBundleName.some((bundle) =>
            attendance.bundle_name.toLowerCase() === bundle.toLowerCase()
          )

          if (state.searchByBundleName.length === 0) {
            return searchText
          } else {
            return searchText && searchByBundleName
          }
        }) ?? []
      )
    },
  },
  actions: {
    async getAllAttendances() {
      try {
        this.isLoading = true
        const result: responseAPI & { data: Attendance[] } = await service.get('/admin/attendance')

        if (result.status !== 200) {
          return
        }

        this.attendances = result.data
      } catch (error) {
        console.error('Error while getting all attendances', error)
      } finally {
        this.isLoading = false
      }
    },
    async postScanMasuk(id: string) {
      try {
        const result: responseAPI = await service.post('/admin/attendance/scan', {
          participant_id: id,
          check: 'in',
        })

        if (result.status !== 200) {
          return
        }
        this.successScanStatus = true
        this.successScanMessage = result.message
      } catch (error: any) {
        if (typeof error?.message == 'string') {
          init({ message: error.message, color: 'danger' })
        }
        console.error('Error while scanning masuk', error)
      }
    },
    async postScanKeluar(id: string) {
      try {
        const result: responseAPI = await service.post('/admin/attendance/scan', {
          participant_id: id,
          check: 'out',
        })

        if (result.status !== 200) {
          return
        }
        this.successScanStatus = true
        this.successScanMessage = result.message
      } catch (error: any) {
        if (typeof error?.message == 'string') {
          init({ message: error.message, color: 'danger' })
        }
        console.error('Error while scanning keluar', error)
      }
    },
  },
})
