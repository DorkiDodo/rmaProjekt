<template>
  <q-page padding>

    <div class="text-h5 q-mb-md">
      Konverter valuta (fiksni tečajevi)
    </div>

    <!-- Unos iznosa -->
  <q-input
    v-model.number="amount"
    type="number"
    label="Iznos"
    outlined
    class="q-mb-md"
  />


    <!-- Iz valute -->
    <q-select
      v-model="from"
      :options="currencyOptions"
      label="Iz valute"
      outlined
      class="q-mb-md"
    />

    <!-- U valutu -->
    <q-select
      v-model="to"
      :options="currencyOptions"
      label="U valutu"
      outlined
      class="q-mb-md"
    />

    <!-- Gumb -->
    <q-btn
      label="Konvertiraj"
      color="primary"
      class="full-width"
      @click="convert"
    />

    <!-- Rezultat -->
    <div class="row justify-center">
  <q-card v-if="result !== null" class="q-mt-md" style="width: 300px;">
    <q-card-section class="text-center">
      <div class="text-h6">
        {{ amount }} {{ from }}
      </div>
      <div class="text-h5 text-primary">
        = {{ result }} {{ to }}
      </div>
    </q-card-section>
  </q-card>
</div>


  </q-page>
</template>

<script setup>
import { ref } from 'vue'

/*
  Fiksni tečajevi u odnosu na EUR
  (1 EUR = x valuta)
*/
const rates = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  JPY: 160
}

const amount = ref(1)
const from = ref('EUR')
const to = ref('USD')
const result = ref(null)

const currencyOptions = ['EUR', 'USD', 'GBP', 'JPY']

function convert () {
  if (!amount.value || amount.value <= 0) return

  const inEur = amount.value / rates[from.value]
  const converted = inEur * rates[to.value]

  result.value = converted.toFixed(2)
}
</script>
