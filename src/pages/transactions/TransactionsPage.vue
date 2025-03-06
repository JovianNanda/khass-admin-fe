<script setup lang="ts">
import ProjectTable from './widgets/ProjectsTable.vue'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import ProjectModalContent from './widgets/ProjectModalContent.vue'
import { useTransactionStore } from '../../stores/transactions'
import { Transaction } from '../../types/transaction'
import { useBundleStore } from '../../stores/bundles'
import { transactionStatus } from '../../services/utils'

const { getAllTransactions, getTransactions } = useTransactionStore()
const { search, isLoading, searchByTxStatus, searchByBundleName } = storeToRefs(useTransactionStore())
const { getAllBundles } = useBundleStore()
const { bundles, isLoading: loadingBundle } = storeToRefs(useBundleStore())

const doShowParticipantModal = ref(false)

const transactionToView = ref<Transaction | null>(null)

const onViewTransaction = (transaction: Transaction) => {
  transactionToView.value = transaction
  doShowParticipantModal.value = true
}

const bundleOptions = ref<string[]>([])

watch(search, () => {
  getTransactions()
})

watch(bundles, () => {
  bundleOptions.value = []
  bundles.value.forEach((bundle) => {
    bundleOptions.value.push(bundle.name)
  })
})

getAllBundles()
getAllTransactions()
</script>

<template>
  <h1 class="page-title">Transaction</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="search" placeholder="Search By tx id, username, email " icon="search" clearable class="" />
          <VaSelect
            v-model="searchByTxStatus"
            placeholder="Tx status"
            :options="transactionStatus"
            multiple
            class="w-full md:w-52"
          />
          <VaSelect
            v-model="searchByBundleName"
            placeholder="Bundle Name"
            :options="bundleOptions"
            :loading="loadingBundle"
            multiple
          />
        </div>
      </div>
      <ProjectTable :transactions="getTransactions()" :loading="isLoading" @view="onViewTransaction" />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ ok }"
    v-model="doShowParticipantModal"
    mobile-fullscreen
    close-button
    hide-default-actions
    size="small"
  >
    <div class="py-4 sm:py-0">
      <h1 class="va-h5">{{ 'Detail Transaction' }}</h1>
      <VaForm>
        <ProjectModalContent :transaction="transactionToView" />
      </VaForm>

      <div class="mt-4 flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="ok">Close</VaButton>
      </div>
    </div>
  </VaModal>
</template>
