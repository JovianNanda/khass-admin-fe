import { defineStore } from 'pinia'

import service from '../services/http-common'

import { useToast } from 'vuestic-ui/web-components'
import { responseAPI } from '../types/responseAPI'
import { Participant } from '../types/participant'
const { init } = useToast()

export const useParticipantStore = defineStore('participant', {
  state: () => {
    return {
      participants: [] as Participant[],
      participant: {} as Participant,
      isLoading: false,
      search: '',
      searchByTxStatus: [] as string[],
      searchByBundleName: [] as string[],
    }
  },
  getters: {
    getparticipants: (state) => () => {
      return (
        state.participants?.filter((participant) => {
          if (state.search === '' && state.searchByTxStatus.length === 0 && state.searchByBundleName.length === 0) {
            return true
          }

          const searchText =
            participant.name.toLowerCase().includes(state.search.toLowerCase()) ||
            participant.identity_number.toLowerCase().includes(state.search.toLowerCase()) ||
            participant.transaction_id.toLowerCase().includes(state.search.toLowerCase())

          const searchByTxStatus = state.searchByTxStatus.some((status) =>
            participant.transaction_status.toLowerCase() === status.toLowerCase(),
          )
          const searchByBundleName = state.searchByBundleName.some((bundle) =>
            participant.bundle_name.toLowerCase() === bundle.toLowerCase(),
          )

          if (state.searchByTxStatus.length === 0 && state.searchByBundleName.length === 0) {
            return searchText
          } else if (state.searchByTxStatus.length > 0 && state.searchByBundleName.length === 0) {
            return searchText && searchByTxStatus
          } else if (state.searchByTxStatus.length === 0 && state.searchByBundleName.length > 0) {
            return searchText && searchByBundleName
          } else {
            return searchText && searchByTxStatus && searchByBundleName
          }
        }) ?? []
      )
    },
  },
  actions: {
    async getAllParticipants() {
      try {
        this.isLoading = true
        const result: responseAPI & { data: Participant[] } = await service.get('/admin/participant')

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }

        this.participants = result.data
      } catch (error) {
        console.error('Error while getting all participants', error)
      } finally {
        this.isLoading = false
      }
    },
    async getParticipantById(id: string | number) {
      try {
        this.isLoading = true
        const result: responseAPI & { data: Participant } = await service.get(`/admin/participant/detail/${id}`)

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }

        this.participant = result.data
      } catch (error) {
        console.error('Error while getting participant by id', error)
      } finally {
        this.isLoading = false
      }
    },
    async exportParticipants() {
      try {
        // this.isLoading = true

        window.open(`${service.defaults.baseURL}/admin/export/participant`, '_blank')

        // const url = window.URL.createObjectURL(new Blob([result.data]))
        // const link = document.createElement('a')
        // link.href = url
        // link.setAttribute('download', 'participants.xlsx')
        // document.body.appendChild(link)
        // link.click()
      } catch (error) {
        console.error('Error while exporting participants', error)
      } finally {
        // this.isLoading = false
      }
    },
  },
})
