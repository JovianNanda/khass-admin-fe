<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'

import { Attendance } from '../../../types/attendance'

const columns = defineVaDataTableColumns([
  // { label: 'transaction_id', key: 'transaction_id', sortable: true },
  { label: 'name', key: 'name' },
  { label: 'identity_number', key: 'identity_number' },
  { label: 'phone', key: 'phone' },
  { label: 'organization', key: 'organization' },
  { label: 'bundle_name', key: 'bundle_name' },
  { label: 'check_in', key: 'check_in' },
  { label: 'check_out', key: 'check_out' },
  { label: ' ', key: 'actions' },
])

const props = defineProps({
  participants: {
    type: Array as PropType<Attendance[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

defineEmits<{
  (event: 'view', participant: Attendance): void
}>()

const attendanceIcon = (check: string) => {
  if (check) {
    return 'check'
  } else {
    return 'close'
  }
}

const attendanceIconColor = (check: string) => {
  if (check) {
    return 'success'
  } else {
    return 'danger'
  }
}

// const avatarColor = (userName: string) => {
//   const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
//   const index = userName.charCodeAt(0) % colors.length
//   return colors[index]
// }

// const sortByVModel = useVModel(props, 'sortBy', emit)
// const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

watch(
  () => props.participants,
  () => {
    currentPage.value = 1
  },
  { deep: true },
)

const perPage = ref(10)
const perPageOptions = [10, 50, 100]
const currentPage = ref(1)

const pages = computed(() =>
  perPage.value && perPage.value > 0 ? Math.ceil(props.participants.length / perPage.value) : props.participants.length,
)
</script>

<template>
  <div>
    <VaDataTable
      :items="participants"
      :columns="columns"
      :loading="loading"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <!-- <template #cell(transaction_status)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <VaBadge :text="rowData.transaction_status" :color="transactionStatusBadgeColor(rowData.transaction_status)"
            class="mr-2" />
        </div>
      </template> -->
      <template #cell(check_in)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px] text-center">
          <VaBadge class="mr-2">
            <VaIcon
              :name="attendanceIcon(rowData.check_in)"
              :color="attendanceIconColor(rowData.check_in)"
              size="30px"
            />
          </VaBadge>
        </div>
      </template>

      <template #cell(check_out)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px] text-center">
          <VaBadge class="mr-2">
            <VaIcon
              :name="attendanceIcon(rowData.check_out)"
              :color="attendanceIconColor(rowData.check_out)"
              size="30px"
            />
          </VaBadge>
        </div>
      </template>

      <template #cell(actions)="{ rowData: participant }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="visibility"
            aria-label="View project"
            @click="$emit('view', participant as Attendance)"
          />
        </div>
      </template>

      <template #bodyAppend>
        <tr>
          <td colspan="6">
            <div class="flex justify-center mt-4">
              <VaPagination
                v-model="currentPage"
                :pages="pages"
                buttons-preset="primary"
                :visible-pages="3"
                active-page-color="textPrimary"
              />
            </div>
          </td>
        </tr>
      </template>
    </VaDataTable>
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <!-- <div>
        <b>Showing {{ participants.length }} results.</b>
      </div> -->
      <div>
        <b>{{ participants.length }} results.</b>
        Results per page
        <VaSelect v-model="perPage" class="!w-20" :options="perPageOptions" />
      </div>

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
