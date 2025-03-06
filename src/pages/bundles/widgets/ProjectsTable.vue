<script setup lang="ts">
import { PropType } from 'vue'
import { VaChip, defineVaDataTableColumns } from 'vuestic-ui'

import type { Bundle } from '../../../types/bundle'
import { rupiah } from '../../../services/utils'

const columns = defineVaDataTableColumns([
  { label: 'Bundle name', key: 'name', sortable: true },
  { label: 'Theater', key: 'theater_name', sortable: true },
  { label: 'Kuota', key: 'kuota' },
  { label: 'Price', key: 'price' },
  { label: 'Close At', key: 'close_at', sortable: true },
  { label: 'Visibility', key: 'visibility' },
  // { label: 'Description', key: 'description', },
  // { label: 'Status', key: 'status', sortable: true },
  { label: ' ', key: 'actions' },
])

defineProps({
  bundles: {
    type: Array as PropType<Bundle[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

defineEmits<{
  (event: 'view', bundle: Bundle): void
  (event: 'edit', bundle: Bundle['id']): void
  (event: 'delete', bundle: Bundle): void
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
    <VaDataTable :items="bundles" :columns="columns" :loading="loading">
      <template #cell(price)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <!-- <UserAvatar :user="rowData.project_owner" size="small" /> -->
          {{ rupiah(rowData.price) }}
        </div>
      </template>
      <template #cell(visibility)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <!-- <UserAvatar :user="rowData.project_owner" size="small" /> -->
          <VaChip :outline="rowData.visibility != 1" readonly>
            {{ rowData.visibility ? 'Visible' : 'Hidden' }}
          </VaChip>
        </div>
      </template>

      <!-- <template #cell(team)="{ rowData: project }">
        <VaAvatarGroup size="small" :options="(project as Project).team.map((user) => ({
          label: user.fullname,
          src: user.avatar,
          fallbackText: user.fullname[0],
          color: avatarColor(user.fullname),
        }))
          " :max="5" />
      </template> -->
      <!-- <template #cell(status)="{ rowData: project }">
        <ProjectStatusBadge :status="project.status" />
      </template> -->

      <template #cell(actions)="{ rowData: bundle }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="visibility"
            aria-label="View project"
            @click="$emit('view', bundle as Bundle)"
          />
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit project"
            @click="$emit('edit', bundle.id as number | string)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete project"
            @click="$emit('delete', bundle as Bundle)"
          />
        </div>
      </template>
    </VaDataTable>
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <div>
        <b>Showing {{ bundles.length }} results.</b>
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
