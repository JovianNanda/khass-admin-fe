import { defineStore } from 'pinia'

import type { Theater } from '../types/theater'
import service from '../services/http-common'

import { useToast } from 'vuestic-ui/web-components'
import router from '../router'
import { responseAPI } from '../types/responseAPI'
const { init } = useToast()

export const useTheaterStore = defineStore('theater', {
  state: () => {
    return {
      theaters: [] as Theater[],
      theater: {} as Theater,
      isLoading: false,
    }
  },

  actions: {
    async getAllTheaters() {
      // Get all theaters
      try {
        this.isLoading = true
        const result: responseAPI & { data: Theater[] } = await service.get('/theater')

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }

        this.theaters = result.data
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while getting all theaters', error)
      } finally {
        this.isLoading = false
      }
    },
    async createNewTheater(newTheater: Omit<Theater, 'id'>) {
      try {
        this.isLoading = true
        const result: responseAPI = await service.post('/admin/theater/create', newTheater)

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }
        init({ message: 'Theater created successfully ', color: 'success' })
        router.push({ name: 'theaters' })
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while getting all theaters', error)
      } finally {
        this.isLoading = false
      }
    },
    async getTheaterById(id: string | number) {
      try {
        this.isLoading = true
        const result: responseAPI & { data: Theater } = await service.get(`/theater/${id}`)

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }
        this.theater = result.data
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while getting theater by id', error)
      } finally {
        this.isLoading = false
      }
    },
    async updateTheater(updatedTheater: Theater) {
      try {
        this.isLoading = true
        const result: responseAPI = await service.post('/admin/theater/update', updatedTheater)

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }
        init({ message: 'Theater updated successfully ', color: 'success' })
        router.push({ name: 'theaters' })
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while update theater', error)
      } finally {
        this.isLoading = false
      }
    },
    async deleteTheater(id: string | number) {
      try {
        this.isLoading = true
        const result: responseAPI = await service.post(`/admin/theater/delete`, { id })

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }
        init({ message: 'Theater deleted successfully ', color: 'success' })

        this.getAllTheaters()
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while create theater', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
