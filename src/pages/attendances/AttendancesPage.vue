<script setup lang="ts">
import ProjectTable from './widgets/ProjectsTable.vue'
import { storeToRefs } from 'pinia'
import { useAttendancesStore } from '../../stores/attendance'
import { ref, watch } from 'vue'
import ProjectModalContent from './widgets/ProjectModalContent.vue'
import { Attendance } from '../../types/attendance'
import { useBundleStore } from '../../stores/bundles'

const { getAllAttendances, getAttendances } = useAttendancesStore()
const { isLoading, search, searchByBundleName } = storeToRefs(useAttendancesStore())
const { getAllBundles } = useBundleStore()
const { bundles, isLoading: loadingBundle } = storeToRefs(useBundleStore())

const doShowParticipantModal = ref(false)

const participantToView = ref<Attendance | null>(null)

const onViewParticipant = (participant: Attendance) => {
  participantToView.value = participant
  doShowParticipantModal.value = true
}

const bundleOptions = ref<string[]>([])

watch(search, () => {
  getAttendances()
})

watch(bundles, () => {
  bundleOptions.value = []
  bundles.value.forEach((bundle) => {
    bundleOptions.value.push(bundle.name)
  })
})

getAllBundles()
getAllAttendances()
</script>

<template>
  <h1 class="page-title">Participants Attendance</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput
            v-model="search"
            placeholder="Search By name, id num, organization"
            icon="search"
            clearable
            class=""
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
      <ProjectTable :participants="getAttendances()" :loading="isLoading" @view="onViewParticipant" />
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
      <h1 class="va-h5">{{ 'Detail Participant Attendance' }}</h1>
      <VaForm>
        <ProjectModalContent :participant="participantToView" />
      </VaForm>

      <div class="mt-4 flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="ok">Close</VaButton>
      </div>
    </div>
  </VaModal>
</template>
