<script setup lang="ts">
import { rupiah, transactionStatusBadgeColor } from '../../../services/utils'
import { Participant } from '../../../types/participant'
import { watch, PropType, ref } from 'vue'

const props = defineProps({
  participant: {
    type: Object as PropType<Participant | null>,
    required: true,
  },
})

const defaultParticipant: Participant = {
  id_participant: 0,
  fee: 0,
  transaction_id: '',
  transaction_status: '',
  transaction_created_at: '',
  transaction_updated_at: '',
  bundle_id: 0,
  bundle_name: '',
  name: '',
  phone: '',
  organization: '',
  identity_number: '',
}

const participantVal = ref<Participant>({ ...defaultParticipant })

watch(
  () => props.participant,
  () => {
    if (!props.participant) {
      return
    }

    participantVal.value = {
      ...props.participant,
    }
  },
  { immediate: true },
)
</script>

<template>
  <VaForm class="flex flex-col self-stretch justify-start items-start gap-4">
    <VaInput v-model="participantVal.transaction_id" readonly label="transaction_id" />
    <div class="flex flex-wrap md:flex-nowrap justify-between w-full gap-4">
      <VaInput v-model="participantVal.transaction_created_at" readonly label="transaction_created_at" class="" />
      <VaInput v-model="participantVal.transaction_updated_at" readonly label="transaction_updated_at" class="" />
    </div>
    <VaInput label="transaction_status" readonly>
      <VaBadge
        :text="participantVal.transaction_status"
        :color="transactionStatusBadgeColor(participantVal.transaction_status)"
        class="mr-2"
      />
    </VaInput>
    <VaInput v-model="participantVal.name" readonly label="name" />
    <VaInput v-model="participantVal.identity_number" readonly label="identity_number" />
    <VaInput v-model="participantVal.organization" readonly label="organization" />
    <VaInput v-model="participantVal.phone" readonly label="phone" />
    <VaInput v-model="participantVal.bundle_name" readonly label="bundle_name" />
    <VaInput readonly label="price">
      <span class="text-sm">{{ rupiah(participantVal.fee) }}</span>
    </VaInput>
  </VaForm>
</template>
