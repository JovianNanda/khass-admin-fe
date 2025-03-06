<script setup lang="ts">
import router from '../../router'
import { useForm } from 'vuestic-ui'
import { reactive, ref } from 'vue'
import { useTheaterStore } from '../../stores/theaters'
import { onBeforeRouteLeave } from 'vue-router'

const { isValid } = useForm('formRef')

const { createNewTheater } = useTheaterStore()

const defaultValue = {
  name: '',
  kuota: 1,
}

const newTheater = reactive({ ...defaultValue })
const isOnSave = ref(false)

const form = useForm('formRef')

const toAllTheater = () => {
  router.push({ name: 'theaters' })
}

const onSave = () => {
  if (form.validate()) {
    // console.log(newTheater);
    isOnSave.value = true
    createNewTheater(newTheater)
  }
}

const isFormDirty = () => {
  return JSON.stringify(newTheater) !== JSON.stringify(defaultValue)
}

onBeforeRouteLeave(() => {
  if (isFormDirty() && !isOnSave.value) {
    return window.confirm('Do you really want to leave? You have unsaved changes!')
  }
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
    <h1 class="page-title">Create Theater</h1>
    <div class="grid content-center">
      <VaButton icon="arrow_back" @click="toAllTheater">Back</VaButton>
    </div>
  </div>

  <VaCard>
    <VaCardContent>
      <VaForm ref="formRef" class="flex flex-col items-baseline gap-6">
        <VaInput
          v-model="newTheater.name"
          :rules="[(value) => (value && value.length > 0) || 'name is required']"
          label="Theater Name"
        />

        <!-- <VaInput v-model="newTheater.kuota" style="width: 150px" label="Kuota" inputmode="numeric" mask="numeral"
          placeholder="####"
          :rules="[(v) => v.length > 0 || 'Kuota is required', (v) => parseInt(v) > 0 || 'Kuota can\'t less than 1']">
          <template #appendInner>
            <span>Orang</span>
          </template>
</VaInput> -->
      </VaForm>

      <VaButton :disabled="!isValid" class="mt-3" @click="onSave"> Create </VaButton>
    </VaCardContent>
  </VaCard>
</template>
