<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui/web-components'
import { useTheaterStore } from '../../stores/theaters'
import { storeToRefs } from 'pinia'
import router from '../../router'
import { useBundleStore } from '../../stores/bundles'
import { formatDate } from '../../services/utils'
import { selectOption } from '../../types/helpers'
import { formBundle } from '../../types/bundle'
import { onBeforeRouteLeave } from 'vue-router'

const { getAllTheaters } = useTheaterStore()
const { theaters, isLoading } = storeToRefs(useTheaterStore())
const { isValid, validate } = useForm('formRef')

const { getBundleById, updateBundle } = useBundleStore()

const {
  today,
  formatDataDate,
  formatDateFn,
  parseDateFn,
  formatDataTime,
  parseDateFromData,
  formatTimeFromData,
  subtracOneMonth,
} = formatDate

const { bundle } = storeToRefs(useBundleStore())

const idUpdatedBundle = router.currentRoute.value.params.id

getAllTheaters()
getBundleById(idUpdatedBundle.toString())

const theaterOptions = ref<selectOption[]>(
  theaters.value?.map((theater) => ({
    text: theater.name,
    value: theater.id,
  })) ?? ([] as selectOption[]),
)

function getSelectedTheater() {
  return theaterOptions.value
    .map((theater) => {
      return bundle.value?.theaters?.find((theaterId) => theaterId == theater.value) ? theater : null
    })
    .filter((theater) => theater !== null) as selectOption[]
}

const goToAllBundle = () => {
  router.push({ name: 'bundle-list' })
}

const defaultValue: formBundle & { id: number | string } = {
  id: idUpdatedBundle as number | string,
  name: '',
  kuota: 0,
  theater: [],
  showDate: today,
  closeDate: today,
  closeTime: `0000`,
  desc: '',
  price: 0,
  visibility: true,
  image_url: '',
  show_type: '',
}

const oldValue: formBundle & { id: number | string } = reactive({
  id: bundle.value?.id ?? idUpdatedBundle,
  name: bundle.value?.name ?? '',
  kuota: bundle.value?.kuota ?? 0,
  theater: getSelectedTheater() ?? [],
  showDate: subtracOneMonth(parseDateFromData(bundle.value?.date)) ?? today,
  // closeDate: closeDateDefault(),
  closeDate: subtracOneMonth(parseDateFromData(bundle.value?.close_at?.split(' ')[0])) ?? today,
  closeTime: formatTimeFromData(bundle.value?.close_at?.split(' ')[1])?.replace(':', '') ?? `0000`, //get time and remove ":" from it, desired value is like this "0000"
  desc: bundle.value?.description ?? '',
  price: bundle.value?.price ?? 0,
  visibility: bundle.value?.visibility == 1 ?? true,
  image_url: bundle.value?.image_url ?? '',
  show_type: bundle.value?.show_type ?? '',
})

const updatedBundle: formBundle & { id: number | string } = reactive({ ...oldValue })

const isOnSave = ref(false)

const onSave = () => {
  if (validate()) {
    // console.log('old', bundle);
    isOnSave.value = true
    if (!updatedBundle.theater) return
    const cleanedTheater = updatedBundle.theater.filter((theater) => theater !== null) //remove null value
    const theaterData: number[] = cleanedTheater.map((theater: selectOption) =>
      typeof theater.value === 'string' ? parseInt(theater.value) : theater.value,
    )

    updateBundle({
      id: updatedBundle.id,
      name: updatedBundle.name,
      theaters: theaterData,
      kuota: updatedBundle.kuota,
      date: formatDataDate(updatedBundle.showDate),
      description: updatedBundle.desc,
      price: updatedBundle.price,
      close_at: `${formatDataDate(updatedBundle.closeDate)} ${formatDataTime(updatedBundle.closeTime)}`,
      visibility: updatedBundle.visibility ? 1 : 0,
      image_url: updatedBundle.image_url,
      show_type: updatedBundle.show_type,
    })
  }
}

watch(
  theaters,
  (newTheaters) => {
    theaterOptions.value = newTheaters.map((theater) => ({
      text: theater.name,
      value: theater.id,
    }))
  },
  { immediate: true, deep: true },
)

watch(
  bundle,
  (newBundle) => {
    updatedBundle.id = newBundle?.id ?? idUpdatedBundle
    updatedBundle.name = newBundle?.name ?? ''
    updatedBundle.kuota = newBundle?.kuota ?? 0
    updatedBundle.showDate = subtracOneMonth(parseDateFromData(newBundle?.date)) ?? today
    updatedBundle.closeDate = subtracOneMonth(parseDateFromData(newBundle?.close_at?.split(' ')[0])) ?? today
    updatedBundle.closeTime = formatTimeFromData(newBundle?.close_at?.split(' ')[1])?.replace(':', '') ?? `0000`
    updatedBundle.desc = newBundle?.description ?? ''
    updatedBundle.price = newBundle?.price ?? 0
    updatedBundle.visibility = newBundle?.visibility == 1 ?? true
    updatedBundle.theater = getSelectedTheater() ?? []
    updatedBundle.image_url = newBundle?.image_url ?? ''
    updatedBundle.show_type = newBundle?.show_type ?? ''

    if (JSON.stringify(defaultValue) === JSON.stringify(oldValue)) {
      oldValue.id = newBundle?.id ?? idUpdatedBundle
      oldValue.name = newBundle?.name ?? ''
      oldValue.kuota = newBundle?.kuota ?? 0
      oldValue.theater = getSelectedTheater() ?? []
      oldValue.showDate = subtracOneMonth(parseDateFromData(newBundle?.date)) ?? today
      oldValue.closeDate = subtracOneMonth(parseDateFromData(newBundle?.close_at?.split(' ')[0])) ?? today
      oldValue.closeTime = formatTimeFromData(newBundle?.close_at?.split(' ')[1])?.replace(':', '') ?? `0000`
      oldValue.desc = newBundle?.description ?? ''
      oldValue.price = newBundle?.price ?? 0
      oldValue.visibility = newBundle?.visibility == 1 ?? true
      oldValue.image_url = newBundle?.image_url ?? ''
      oldValue.show_type = newBundle?.show_type ?? ''
    }
  },
  { immediate: true, deep: true },
)

const isFormDirty = () => {
  console.log(oldValue.showDate)
  console.log(updatedBundle.showDate)

  const oldShowDate = oldValue.showDate.toDateString().split('T')[0]
  const updatedShowDate = updatedBundle.showDate.toDateString().split('T')[0]

  const oldVal = {
    ...oldValue,
    showDate: oldShowDate,
  }
  const updatedVal = {
    ...updatedBundle,
    showDate: updatedShowDate,
  }
  return JSON.stringify(oldVal) !== JSON.stringify(updatedVal)
}

onBeforeRouteLeave(() => {
  if (isFormDirty() && !isOnSave.value) {
    return window.confirm('Do you really want to leave? You have unsaved changes!')
  }
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
    <h1 class="page-title">Update Bundle</h1>
    <div class="grid content-center">
      <VaButton icon="arrow_back" @click="goToAllBundle">Back</VaButton>
    </div>
  </div>

  <VaCard>
    <VaCardContent>
      <VaForm ref="formRef" class="flex flex-col items-baseline gap-6">
        <VaInput
          v-model="updatedBundle.name"
          :rules="[(value) => (value && value.length > 0) || 'name is required']"
          label="Bundle Name"
        />
        <VaInput
          v-model="updatedBundle.show_type"
          :rules="[(value) => (value && value.length > 0) || 'show type is required']"
          label="Show Type"
        />

        <VaSelect
          v-model="updatedBundle.theater"
          :loading="isLoading"
          :options="theaterOptions"
          multiple
          :rules="[(v) => (Array.isArray(v) && v.length > 0) || 'Field is required']"
          label="Theater"
        />

        <VaInput
          v-model="updatedBundle.image_url"
          :rules="[(value) => (value && value.length > 0) || 'image url is required']"
          label="Image URL"
        />

        <div class="flex flex-wrap gap-4">
          <VaInput
            v-model="updatedBundle.kuota"
            style="width: 150px"
            label="Kuota"
            inputmode="numeric"
            mask="numeral"
            placeholder="####"
            :rules="[(v) => parseInt(v) > 0 || 'Kuota can\'t less than 1']"
          >
            <template #appendInner>
              <span>Orang</span>
            </template>
          </VaInput>
          <VaInput
            v-model="updatedBundle.price"
            style="width: 200px"
            label="Price"
            inputmode="numeric"
            mask="numeral"
            placeholder="####"
            :rules="[(v) => v.length > 0 || 'Price is required', (v) => parseInt(v) > 0 || 'Price can\'t less than 1']"
          >
            <template #prependInner>
              <span>Rp.</span>
            </template>
          </VaInput>
        </div>

        <div class="flex flex-wrap gap-4 align-end">
          <VaDateInput
            v-model="updatedBundle.showDate"
            :format="formatDateFn"
            :parse="parseDateFn"
            clearable
            label="The Show Date"
          />
          <VaCheckbox v-model="updatedBundle.visibility" label="Bundle Visibility" class="mt-5" />
        </div>
        <div class="flex flex-wrap gap-4">
          <VaDateInput
            v-model="updatedBundle.closeDate"
            :format="formatDateFn"
            :parse="parseDateFn"
            clearable
            label="Close Registration Date"
          />
          <!-- <VaInput v-model="bundle.closeDate" style="width: fit-content;" label="Close Registration Date"
            placeholder=" DD/MM/YYYY" mask="date" messages="DD/MM/YYYY" /> -->
          <VaInput
            v-model="updatedBundle.closeTime"
            style="width: 150px"
            label="Close Registration Time"
            placeholder="HH:MM"
            mask="time"
            :messages="['HH:MM', 'Hours:minutes']"
            :rules="[]"
          />
        </div>
        <VaTextarea v-model="updatedBundle.desc" style="width: 100%" label="Bundle Description" />
      </VaForm>

      <VaButton :disabled="!isValid" class="mt-3" @click="onSave"> Update </VaButton>
    </VaCardContent>
  </VaCard>
</template>
