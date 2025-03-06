<script setup lang="ts">
import router from '../../router'
import { useForm } from 'vuestic-ui'
import { ref } from 'vue'
import { useTheaterStore } from '../../stores/theaters'
import { storeToRefs } from 'pinia'
import { onBeforeRouteLeave } from 'vue-router'

const { getTheaterById, updateTheater } = useTheaterStore()
const { theater } = storeToRefs(useTheaterStore())

const idUpdatedTheater = router.currentRoute.value.params.id
getTheaterById(idUpdatedTheater.toString())

const form = useForm('formRef')
const oldTheaterValue = theater.value

const isOnSave = ref(false)

const toAllTheater = () => {
  router.push({ name: 'theaters' })
}

const onSave = () => {
  if (form.validate()) {
    // console.log(theater.value);
    isOnSave.value = true
    updateTheater(theater.value)
  }
}

const isFormDirty = () => {
  return JSON.stringify(oldTheaterValue) !== JSON.stringify(theater.value)
}

onBeforeRouteLeave(() => {
  if (isFormDirty() && !isOnSave.value) {
    return window.confirm('Do you really want to leave? You have unsaved changes!')
  }
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
    <h1 class="page-title">Edit Theater</h1>
    <div class="grid content-center">
      <VaButton icon="arrow_back" @click="toAllTheater">Back</VaButton>
    </div>
  </div>

  <VaCard>
    <VaCardContent>
      <VaForm v-slot="{ isValid }" ref="formRef" class="flex flex-col items-baseline gap-6">
        <VaInput
          v-model="theater.name"
          :rules="[(value) => (value && value.length > 0) || 'name is required']"
          label="Theater Name"
        />

        <!-- <VaInput v-model="theater.kuota" style="width: 150px" label="Kuota" inputmode="numeric" mask="numeral"
          placeholder="####"
          :rules="[(v) => v.length > 0 || 'Kuota is required', (v) => parseInt(v) > 0 || 'Kuota can\'t less than 1']">
          <template #appendInner>
            <span>Orang</span>
          </template>
</VaInput> -->

        <VaButton :disabled="!isValid" class="mt-3" @click="onSave"> Update </VaButton>
      </VaForm>
    </VaCardContent>
  </VaCard>
</template>
