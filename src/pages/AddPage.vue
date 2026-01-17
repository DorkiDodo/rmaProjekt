<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">BTC to EUR Exchange</div>

    <q-input v-model.number="amount" type="number" label="Amount (BTC)" outlined class="q-mb-md"
    />

    <q-btn label="Exchange" color="primary" class="full-width q-mb-md" @click="exchange" :loading="loading"
    />

    <q-card v-if="result !== null" class="q-mt-md">
      <q-card-section class="text-center">
        <div class="text-h6">{{ amount }} BTC =</div>
        <div class="text-h5 text-primary">{{ result }} EUR</div>
      </q-card-section>
    </q-card>

    <q-banner v-if="error" class="bg-negative text-white q-mt-md" rounded>
      {{ error }}
    </q-banner>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { getBtcToEurRate } from '../services/crypto.js'

import { useValute } from 'src/services/valute';

const {
  amount,
  result,
  loading,

} = useValute();

const error = ref(null)

async function exchange() {
  loading.value = true
  error.value = null
  result.value = null

  try {
    const rate = await getBtcToEurRate()
    result.value = (amount.value * rate).toFixed(2)
  } catch (err) {
    console.error('Exchange error:', err)
    error.value = err.message || 'Failed to get exchange rate'
  } finally {
    loading.value = false
  }
}
</script>
