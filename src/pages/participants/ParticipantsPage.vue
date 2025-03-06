<script setup lang="ts">
import ProjectTable from './widgets/ProjectsTable.vue'
import { storeToRefs } from 'pinia'
import { useParticipantStore } from '../../stores/participants'
import { ref, watch } from 'vue'
import ProjectModalContent from './widgets/ProjectModalContent.vue'
import { Participant } from '../../types/participant'
import { transactionStatus } from '../../services/utils'
import { useBundleStore } from '../../stores/bundles'

const { getAllParticipants, getparticipants, exportParticipants } = useParticipantStore()
const { isLoading, search, searchByBundleName, searchByTxStatus } = storeToRefs(useParticipantStore())
const { getAllBundles } = useBundleStore()
const { bundles, isLoading: loadingBundle } = storeToRefs(useBundleStore())

const doShowParticipantModal = ref(false)

const participantToView = ref<Participant | null>(null)

const onViewParticipant = (participant: Participant) => {
  participantToView.value = participant
  doShowParticipantModal.value = true
}

const bundleOptions = ref<string[]>([])

watch(search, () => {
  getparticipants()
})

watch(bundles, () => {
  bundleOptions.value = []
  bundles.value.forEach((bundle) => {
    bundleOptions.value.push(bundle.name)
  })
})

getAllBundles()
getAllParticipants()
</script>

<template>
  <h1 class="page-title">Participant</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="search" placeholder="Search By name, nim or tx id" icon="search" clearable class="" />
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
        <VaButton icon="download" color="#008000" @click="exportParticipants">Export</VaButton>
      </div>
      <ProjectTable :participants="getparticipants()" :loading="isLoading" @view="onViewParticipant" />
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
      <h1 class="va-h5">{{ 'Detail Participant' }}</h1>
      <VaForm>
        <ProjectModalContent :participant="participantToView" />
      </VaForm>

      <div class="mt-4 flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="ok">Close</VaButton>
      </div>
    </div>
  </VaModal>
</template>
