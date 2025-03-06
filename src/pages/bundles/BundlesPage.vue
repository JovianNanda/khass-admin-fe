<script setup lang="ts">
import router from '../../router'
import { useBundleStore } from '../../stores/bundles'
import { Bundle } from '../../types/bundle'
import ProjectTable from './widgets/ProjectsTable.vue'
import { storeToRefs } from 'pinia'
import { useModal } from 'vuestic-ui'

const { confirm } = useModal()

const { getAllBundles, deleteBundle } = useBundleStore()
const { bundles, bundle, isLoading } = storeToRefs(useBundleStore())

getAllBundles()

const createNewBundle = () => {
  router.push({ name: 'bundle-create' })
}

const editBundle = (id: Bundle['id']) => {
  const foundBundle = bundles.value.find((bundle) => bundle.id === Number(id))
  if (foundBundle) {
    bundle.value = foundBundle
    router.push({ name: 'bundle-update', params: { id } })
  } else {
    console.log('bundle not found')
  }
}

const onDeleteBundle = (bundle: Pick<Bundle, 'id' | 'name'>) => {
  confirm({
    title: `Delete ${bundle.name}`,
    message: `Are you sure you want to delete ${bundle.name}?`,
    okText: 'Yes, delete it',
    onOk: () => {
      deleteBundle(bundle.id)
    },
  })
}

const onViewBundle = (bundle: Bundle) => {
  router.push({ name: 'bundle-detail', params: { id: bundle.id.toString() } })
}
</script>

<template>
  <h1 class="page-title">Bundles</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add" @click="createNewBundle">Bundle</VaButton>
      </div>
      <ProjectTable
        :bundles="bundles"
        :loading="isLoading"
        @view="onViewBundle"
        @edit="editBundle"
        @delete="onDeleteBundle"
      />
    </VaCardContent>
  </VaCard>
</template>
