<template>
  <q-page padding class="convert-page">

    <div class="text-h5 q-pmb-md"> Konverter valuta</div>

    <q-input
    v-model.number="amount"
    type="number"
    label="Iznos"
    outlined
    class="q-mb-md"
    />

    <!-- Odabir početne valute -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col">
          <q-select
            v-model="from"
            :options="currencyOpt"
            label="Iz valute"
            outlined
          />
        </div>

        <div class="col">
        <q-select
          v-model="to"
          :options="currencyOpt"
          label="U valutu"
          outlined
          />
        </div>
      </div>

    <!-- Gumb za konverziju -->
     <q-btn
     label="Konvertiraj"
     color="secondary"
     class="full-width q-mb-md"
     @click="convertCurrency"
     :loading="loading" />

    <!-- Prikaz rezultata -->
     <q-card v-if="result !== null" class="q-mt-md">
        <q-card-section class="text-center">
          <div class="text-h6">
            {{ amount }} {{ from }} =
          </div>
          <div class="text-h5 text-primary">
            {{ result }} {{ to }}
          </div>
        </q-card-section>
     </q-card>

    <q-btn
      flat
      label=""
      class="q-mt-lg"
      @click="$router.push('/')"
    />

  </q-page>


</template>

<script setup>
import { ref } from 'vue'

const amount = ref(1)
const from = ref('USD')
const to = ref('EUR')
const result = ref(null)
const loading = ref(false)

const currencyOpt = [
  'EUR', 'USD', 'GBP', 'BTC', 'JPY'
]

async function convertCurrency () {
  if (!amount.value || amount.value <= 0) return

  loading.value = true
  result.value = null

  try {
    const response = await fetch(
      `https://api.exchangerate.host/convert?from=${from.value}&to=${to.value}&amount=${amount.value}`
    )

    const data = await response.json()

    if (!data || data.success === false || typeof data.result !== 'number') {
      throw new Error('Neispravan odgovor API-ja')
    }

    result.value = data.result.toFixed(2)

  } catch (error) {
    console.error('Greška pri konverziji:', error)
    result.value = 'Greška'
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>

</style>
