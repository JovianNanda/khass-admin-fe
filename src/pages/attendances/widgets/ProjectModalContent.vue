<script setup lang="ts">
import { Attendance } from '../../../types/attendance'
import { watch, PropType, ref } from 'vue'
import { formatDate } from '../../../services/utils'

const props = defineProps({
  participant: {
    type: Object as PropType<Attendance | null>,
    required: true,
  },
})

const defaultParticipant: Attendance = {
  bundle_name: '',
  check_in: null,
  check_out: null,
  id_participant: 0,
  identity_number: '',
  name: '',
  organization: '',
  phone: '',
}

const { monthNames } = formatDate

const dateFormatted = (date: Date | string | null) => {
  if (!date) return ''

  const d = new Date(date)

  const datestring = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`

  return datestring
}

const participantVal = ref<Attendance>({ ...defaultParticipant })

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
    <VaInput v-model="participantVal.name" readonly label="name" />
    <VaInput v-model="participantVal.identity_number" readonly label="identity_number" />
    <VaInput v-model="participantVal.organization" readonly label="organization" />
    <VaInput v-model="participantVal.phone" readonly label="phone" />
    <VaInput v-model="participantVal.bundle_name" readonly label="bundle_name" />
    <div class="flex flex-wrap md:flex-nowrap justify-between w-full gap-4">
      <VaInput readonly label="check_in" class="">
        {{ dateFormatted(participantVal.check_in) }}
      </VaInput>
      <VaInput readonly label="check_out" class="">
        {{ dateFormatted(participantVal.check_out) }}
      </VaInput>
    </div>
  </VaForm>
</template>
