<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useTheaterStore } from '../../stores/theaters'
import { storeToRefs } from 'pinia'
import router from '../../router'
import { useBundleStore } from '../../stores/bundles'
import { formatDate } from '../../services/utils'
import { selectOption } from '../../types/helpers'
import { formBundle } from '../../types/bundle'

const { getAllTheaters } = useTheaterStore()
const { theaters, isLoading } = storeToRefs(useTheaterStore())

const { getBundleById } = useBundleStore()

const { today, formatDateFn, parseDateFn, parseDateFromData, formatTimeFromData, subtracOneMonth } = formatDate

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

const detailBundle: formBundle & { id: number | string } = reactive({
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
    detailBundle.id = newBundle?.id ?? idUpdatedBundle
    detailBundle.name = newBundle?.name ?? ''
    detailBundle.kuota = newBundle?.kuota ?? 0
    detailBundle.showDate = subtracOneMonth(parseDateFromData(newBundle?.date)) ?? today
    detailBundle.closeDate = subtracOneMonth(parseDateFromData(newBundle?.close_at?.split(' ')[0])) ?? today
    detailBundle.closeTime = formatTimeFromData(newBundle?.close_at?.split(' ')[1])?.replace(':', '') ?? `0000`
    detailBundle.desc = newBundle?.description ?? ''
    detailBundle.price = newBundle?.price ?? 0
    detailBundle.visibility = newBundle?.visibility == 1 ?? true
    detailBundle.theater = getSelectedTheater() ?? []
    detailBundle.image_url = newBundle?.image_url ?? ''
    detailBundle.show_type = newBundle?.show_type ?? ''
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
    <h1 class="page-title">Detail Bundle</h1>
    <div class="grid content-center">
      <VaButton icon="arrow_back" @click="goToAllBundle">Back</VaButton>
    </div>
  </div>

  <VaCard>
    <VaCardContent>
      <VaForm ref="formRef" class="flex flex-col items-baseline gap-6">
        <VaInput
          v-model="detailBundle.name"
          readonly
          :rules="[(value) => (value && value.length > 0) || 'name is required']"
          label="Bundle Name"
        />

        <VaInput
          v-model="detailBundle.show_type"
          readonly
          :rules="[(value) => (value && value.length > 0) || 'show type is required']"
          label="Show Type"
        />

        <VaSelect
          v-model="detailBundle.theater"
          readonly
          :loading="isLoading"
          :options="theaterOptions"
          multiple
          :rules="[(v) => (Array.isArray(v) && v.length > 0) || 'Field is required']"
          label="Theater"
        />

        <VaInput
          v-model="detailBundle.image_url"
          readonly
          :rules="[(value) => (value && value.length > 0) || 'image url is required']"
          label="Image URL"
        />

        <div class="flex flex-wrap gap-4">
          <VaInput
            v-model="detailBundle.kuota"
            readonly
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
            v-model="detailBundle.price"
            readonly
            style="width: 200px"
            label="Price"
            inputmode="numeric"
            mask="numeral"
            placeholder="####"
          >
            <template #prependInner>
              <span>Rp.</span>
            </template>
          </VaInput>
        </div>

        <div class="flex flex-wrap gap-4 align-end">
          <VaDateInput
            v-model="detailBundle.showDate"
            readonly
            :format="formatDateFn"
            :parse="parseDateFn"
            clearable
            label="The Show Date"
          />
          <VaCheckbox v-model="detailBundle.visibility" readonly label="Bundle Visibility" class="mt-5" />
        </div>
        <div class="flex flex-wrap gap-4">
          <VaDateInput
            v-model="detailBundle.closeDate"
            readonly
            :format="formatDateFn"
            :parse="parseDateFn"
            clearable
            label="Close Registration Date"
          />
          <!-- <VaInput v-model="bundle.closeDate" style="width: fit-content;" label="Close Registration Date"
            placeholder=" DD/MM/YYYY" mask="date" messages="DD/MM/YYYY" /> -->
          <VaInput
            v-model="detailBundle.closeTime"
            readonly
            style="width: 150px"
            label="Close Registration Time"
            placeholder="HH:MM"
            mask="time"
            :messages="['HH:MM', 'Hours:minutes']"
            :rules="[]"
          />
        </div>
        <VaTextarea v-model="detailBundle.desc" style="width: 100%" label="Bundle Description" />
      </VaForm>
    </VaCardContent>
  </VaCard>
</template>
