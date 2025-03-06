<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'

import { rupiah } from '../../../services/utils'

import { transactionStatusBadgeColor } from '../../../services/utils'
import { Transaction } from '../../../types/transaction'

const columns = defineVaDataTableColumns([
  { label: 'transaction_id', key: 'id', sortable: true },
  { label: 'transaction_status', key: 'status' },
  { label: 'payment_method_name', key: 'payment_method_name' },
  { label: 'price', key: 'total_price' },
  { label: 'username', key: 'username' },
  { label: 'email', key: 'user_email' },
  { label: 'bundle_name', key: 'bundle_name' },
  { label: ' ', key: 'actions' },
])

const props = defineProps({
  transactions: {
    type: Array as PropType<Transaction[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

defineEmits<{
  (event: 'view', transaction: Transaction): void
}>()

// const avatarColor = (userName: string) => {
//   const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
//   const index = userName.charCodeAt(0) % colors.length
//   return colors[index]
// }

// const sortByVModel = useVModel(props, 'sortBy', emit)
// const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

// const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
watch(
  () => props.transactions,
  () => {
    currentPage.value = 1
  },
  { deep: true },
)

const perPage = ref(10)
const perPageOptions = [10, 50, 100]
const currentPage = ref(1)

const pages = computed(() =>
  perPage.value && perPage.value > 0 ? Math.ceil(props.transactions.length / perPage.value) : props.transactions.length,
)
</script>

<template>
  <div>
    <VaDataTable
      :items="transactions"
      :columns="columns"
      :loading="loading"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(status)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <VaBadge :text="rowData.status" :color="transactionStatusBadgeColor(rowData.status)" class="mr-2" />
        </div>
      </template>
      <template #cell(total_price)="{ rowData }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          <span class="text-sm">{{ rupiah(rowData.total_price) }}</span>
        </div>
      </template>

      <template #cell(actions)="{ rowData: transaction }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="visibility"
            aria-label="View project"
            @click="$emit('view', transaction as Transaction)"
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
        <b>Showing {{ transactions.length }} results.</b>
      </div> -->
      <div>
        <b>{{ transactions.length }} results.</b>
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
