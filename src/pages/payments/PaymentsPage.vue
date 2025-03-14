<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref } from 'vue'
import imgSuccess from './checkmark.svg'
import { usePaymentStore } from '../../stores/payment'
import { storeToRefs } from 'pinia'

const facingMode = ref('environment')
const paused = ref(false)
const showScanConfirmation = ref(false)

const { postCashPayment } = usePaymentStore()
const { successScanMessage, successScanStatus } = storeToRefs(usePaymentStore())
const resultScan = ref()

function switchCamera() {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
}

function onCameraOn() {
  showScanConfirmation.value = false
}

function onCameraOff() {
  showScanConfirmation.value = true
}

const onError = (val) => alert(val)

function resetScanValue() {
  successScanMessage.value = ''
  successScanStatus.value = false
  resultScan.value = ''
}

async function onDetect(detectedCodes) {
  // const result = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  const result = detectedCodes.map((code) => code.rawValue).join('')
  console.log(result)

  paused.value = true
  await postCashPayment(result)
  resultScan.value = successScanMessage
  await timeout(850)
  paused.value = false
  resetScanValue()
}

function timeout(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
</script>

<template>
  <h1 class="page-title">Scan Pembayaran CASH</h1>

  <div class="max-w-xs mb-4">
    <!-- <VaSelect v-model="SelectedCamera" class="mb-6" label="Camera" :options="cameraOptions" text-by="textBy"
      track-by="value" /> -->
    <div class="options cursor-pointer" @click="switchCamera">
      <VaIcon class="mr-2" name="cameraswitch" :size="36" />
      <span>Flip Camera</span>
    </div>
  </div>
  <QrcodeStream
    :constraints="{ facingMode }"
    :paused="paused"
    @detect="onDetect"
    @cameraOn="onCameraOn"
    @cameraOff="onCameraOff"
    @error="onError"
  >
    <div v-show="showScanConfirmation" class="scan-confirmation">
      <div class="text_gambar">
        <img v-if="successScanStatus" :src="imgSuccess" alt="Checkmark" width="128" />
        <h4 class="text-[20px] md:text-[24px] leading-10 font-bold text-black mx-4 text-center">{{ resultScan }}</h4>
      </div>
    </div>
  </QrcodeStream>
</template>

<style scoped>
.scan-confirmation {
  /* position: absolute; */
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);

  display: flex;
  /* flex-flow: row nowrap; */
  justify-content: center;
}

.text_gambar {
  display: flex;
  flex-flow: column;
  /* width: 128px; */
  justify-content: center;
  align-items: center;
}
</style>
