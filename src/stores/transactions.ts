import { defineStore } from 'pinia'

import service from '../services/http-common'

import { useToast } from 'vuestic-ui/web-components'
import { responseAPI } from '../types/responseAPI'
import { Transaction } from '../types/transaction'
const { init } = useToast()

export const useTransactionStore = defineStore('transaction', {
  state: () => {
    return {
      transactions: [] as Transaction[],
      transaction: {} as Transaction,
      isLoading: false,
      search: '',
      searchByTxStatus: [] as string[],
      searchByBundleName: [] as string[],
    }
  },
  getters: {
    getTransactions: (state) => () => {
      return (
        state.transactions?.filter((tx) => {
          if (state.search === '' && state.searchByTxStatus.length === 0 && state.searchByBundleName.length === 0) {
            return true
          }

          const searchText =
            tx.username.toLowerCase().includes(state.search.toLowerCase()) ||
            tx.user_email.toLowerCase().includes(state.search.toLowerCase()) ||
            tx.id.toLowerCase().includes(state.search.toLowerCase())

          const searchByTxStatus = state.searchByTxStatus.some((status) =>
            tx.status.toLowerCase() === status.toLowerCase(),
          )
          const searchByBundleName = state.searchByBundleName.some((bundle) =>
            tx.bundle_name.toLowerCase() === bundle.toLowerCase(),
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
    async getAllTransactions() {
      try {
        this.isLoading = true
        const result: responseAPI & { data: Transaction[] } = await service.get('/admin/transactions')

        if (result.status !== 200) {
          init({ message: result.message, color: 'danger' })
          return
        }

        this.transactions = result.data
      } catch (error) {
        console.error('Error while getting all transactions', error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
