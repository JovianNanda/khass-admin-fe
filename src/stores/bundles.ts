import { defineStore } from 'pinia'

import { Bundle } from '../types/bundle'
import service from '../services/http-common'

import { useToast } from 'vuestic-ui/web-components'
import router from '../router'
import { responseAPI } from '../types/responseAPI'
const { init } = useToast()

export const useBundleStore = defineStore('bundle', {
  state: () => {
    return {
      bundles: [] as Bundle[],
      bundle: null as unknown as Bundle,
      isLoading: false,
    }
  },

  actions: {
    async getAllBundles() {
      // Get all bundles
      try {
        this.isLoading = true
        const result: responseAPI & { data: Bundle[] } = await service.get('/admin/bundle')

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }

        this.bundles = result.data
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while getting all bundles', error)
      } finally {
        this.isLoading = false
      }
    },
    async createNewBundle(newBundle: Omit<Bundle, 'id' | 'theater_name'>) {
      try {
        this.isLoading = true
        const result: responseAPI = await service.post('/admin/bundle/create', newBundle)

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }
        init({ message: 'Bundle created successfully ', color: 'success' })
        router.push({ name: 'bundles' })
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while create bundle', error)
      } finally {
        this.isLoading = false
      }
    },
    async getBundleById(id: string | number) {
      try {
        this.isLoading = true
        const result: responseAPI & { data: Bundle } = await service.get(`/bundle/${id}`)

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }

        this.bundle = result.data
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while getting bundle by id', error)
      } finally {
        this.isLoading = false
      }
    },
    async updateBundle(updatedBundle: Omit<Bundle, 'theater_name'>) {
      try {
        this.isLoading = true
        const result: responseAPI = await service.post(`/admin/bundle/update`, updatedBundle)

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }
        init({ message: 'Bundle updated successfully ', color: 'success' })
        router.push({ name: 'bundles' })
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while update bundle', error)
      } finally {
        this.isLoading = false
      }
    },
    async deleteBundle(id: string | number) {
      try {
        this.isLoading = true
        const result: responseAPI = await service.post(`/admin/bundle/delete`, { id })

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }
        init({ message: 'Bundle deleted successfully ', color: 'success' })
        this.getAllBundles()
      } catch (error) {
        // init({ message: 'Server Error', color: 'danger' })
        console.error('Error while delete bundle', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
