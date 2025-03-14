import { defineStore } from 'pinia'

import service from '../services/http-common'
import { responseAPI } from '../types/responseAPI'
import { useToast } from 'vuestic-ui/web-components'

const { init } = useToast()

export const usePaymentStore = defineStore('payment', {
  state: () => {
    return {
      successScanMessage: '',
      successScanStatus: false,
    }
  },
  actions: {
    async postCashPayment(id: string) {
      try {
        const result: responseAPI = await service.post('/admin/payment/scan', {
          id_transaction: id,
        })
        console.log(result)
        if (result.status !== 200) {
          return
        }
        this.successScanStatus = true
        this.successScanMessage = result.message
      } catch (error: any) {
        if (typeof error?.message == 'string') {
          init({ message: error.message, color: 'danger' })
        }
        console.error('Error while scanning payment', error)
      }
    },
  },
})
