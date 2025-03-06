<script setup lang="ts">
import { copyToClipboard, rupiah, transactionStatusBadgeColor } from '../../../services/utils'
import { watch, PropType, ref } from 'vue'
import { Transaction } from '../../../types/transaction'

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction | null>,
    required: true,
  },
})

const defaultTransaction: Transaction = {
  id: '',
  total_price: 0,
  admin_fee: 0,
  status: '',
  payment_method_type: '',
  payment_method_name: '',
  payment_url: '',
  created_at: '',
  updated_at: '',
  username: '',
  user_email: '',
  bundle_name: '',
  transaction_created_at: '',
  transaction_updated_at: '',
}

const transactionVal = ref<Transaction>({ ...defaultTransaction })

watch(
  () => props.transaction,
  () => {
    if (!props.transaction) {
      return
    }

    transactionVal.value = {
      ...props.transaction,
    }
  },
  { immediate: true },
)
</script>

<template>
  <VaForm class="self-stretch flex-col justify-start items-start gap-4 flex">
    <VaInput v-model="transactionVal.id" label="Transaction ID" readonly />
    <VaInput v-model="transactionVal.username" label="Username" readonly />
    <VaInput v-model="transactionVal.user_email" label="User Email" readonly />
    <VaInput v-model="transactionVal.bundle_name" label="Bundle Name" readonly />
    <div class="flex flex-wrap md:flex-nowrap justify-between w-full gap-4">
      <VaInput label="Total Price" readonly>
        <span class="text-sm">{{ rupiah(transactionVal.total_price) }}</span>
      </VaInput>
      <VaInput label="Admin Fee" readonly>
        <span class="text-sm">{{ rupiah(transactionVal.admin_fee) }}</span>
      </VaInput>
    </div>
    <VaInput label="Transaction Status" readonly>
      <VaBadge :text="transactionVal.status" :color="transactionStatusBadgeColor(transactionVal.status)" class="mr-2" />
    </VaInput>
    <VaInput v-model="transactionVal.payment_url" label="Payment URL" readonly>
      <template #append>
        <VaIcon
          name="content_copy"
          class="ml-2"
          color="secondary"
          @click="copyToClipboard(transactionVal.payment_url)"
        />
      </template>
    </VaInput>
    <div class="flex flex-wrap md:flex-nowrap justify-between w-full gap-4">
      <VaInput v-model="transactionVal.payment_method_type" label="Payment Method Type" readonly />
      <VaInput v-model="transactionVal.payment_method_name" label="Payment Method Name" readonly />
    </div>
    <div class="flex flex-wrap md:flex-nowrap justify-between w-full gap-4">
      <VaInput v-model="transactionVal.created_at" label="Created At" readonly />
      <VaInput v-model="transactionVal.updated_at" label="Updated At" readonly />
    </div>
    <div class="flex flex-wrap md:flex-nowrap justify-between w-full gap-4">
      <VaInput v-model="transactionVal.transaction_created_at" label="Transaction Created At" readonly />
      <VaInput v-model="transactionVal.transaction_updated_at" label="Transaction Updated At" readonly />
    </div>
  </VaForm>
</template>
