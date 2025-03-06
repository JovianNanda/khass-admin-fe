<script setup lang="ts">
import { PropType } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'

import { Theater } from '../../../types/theater'

const columns = defineVaDataTableColumns([
  { label: 'Theater name', key: 'name', sortable: true },
  // { label: 'Kuota', key: 'kuota' },
  // { label: 'Status', key: 'status', sortable: true },
  { label: ' ', key: 'actions' },
])

defineProps({
  theaters: {
    type: Array as PropType<Theater[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

defineEmits<{
  (event: 'edit', theater: Theater): void
  (event: 'delete', theater: Theater): void
}>()

// const avatarColor = (userName: string) => {
//   const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
//   const index = userName.charCodeAt(0) % colors.length
//   return colors[index]
// }

// const sortByVModel = useVModel(props, 'sortBy', emit)
// const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

// const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
</script>

<template>
  <div>
    <VaDataTable :items="theaters" :columns="columns" :loading="loading">
      <template #cell(kuota)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <!-- <UserAvatar :user="rowData.project_owner" size="small" /> -->
          {{ `${rowData.kuota} orang` }}
        </div>
      </template>

      <template #cell(actions)="{ rowData: theater }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit project"
            @click="$emit('edit', theater.id as Theater)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete project"
            @click="$emit('delete', theater as Theater)"
          />
        </div>
      </template>
    </VaDataTable>
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <div>
        <b>Showing {{ theaters.length }} results.</b>
      </div>
      <!-- <div>
        <b>{{ $props.pagination.total }} results.</b>
        Results per page
        <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
      </div> -->

      <!-- <div v-if="totalPages > 1" class="flex">
        <VaButton preset="secondary" icon="va-arrow-left" aria-label="Previous page"
          :disabled="$props.pagination.page === 1" @click="$props.pagination.page--" />
        <VaButton class="mr-2" preset="secondary" icon="va-arrow-right" aria-label="Next page"
          :disabled="$props.pagination.page === totalPages" @click="$props.pagination.page++" />
        <VaPagination v-model="$props.pagination.page" buttons-preset="secondary" :pages="totalPages" :visible-pages="5"
          :boundary-links="false" :direction-links="false" />
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
