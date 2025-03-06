<script setup lang="ts">
import router from '../../router'
import { useTheaterStore } from '../../stores/theaters'
import { Theater } from '../../types/theater'
import ProjectTable from './widgets/ProjectsTable.vue'
import { storeToRefs } from 'pinia'
import { useModal } from 'vuestic-ui'

const { confirm } = useModal()

const { getAllTheaters, deleteTheater } = useTheaterStore()
const { theaters, theater, isLoading } = storeToRefs(useTheaterStore())

getAllTheaters()

const createNewTheater = () => {
  router.push({ name: 'theater-create' })
}

const onEditTheater = (idUpdatedTheater: Pick<Theater, 'id'>) => {
  const foundTheater = theaters.value.find((theater) => theater.id === Number(idUpdatedTheater))
  if (foundTheater) {
    theater.value = foundTheater
    router.push({ name: 'theater-update', params: { id: idUpdatedTheater.toString() } })
  } else {
    console.log('Theater not found')
  }
}

const onDeleteTheater = (theater: Pick<Theater, 'id' | 'name'>) => {
  confirm({
    title: `Delete ${theater.name}`,
    message: `Are you sure you want to delete ${theater.name}?`,
    okText: 'Yes, delete it',
    onOk: () => {
      deleteTheater(theater.id)
    },
  })
}
</script>

<template>
  <h1 class="page-title">Theater</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start"></div>
        <VaButton icon="add" @click="createNewTheater">Theater</VaButton>
      </div>
      <ProjectTable :theaters="theaters" :loading="isLoading" @edit="onEditTheater" @delete="onDeleteTheater" />
    </VaCardContent>
  </VaCard>
</template>
