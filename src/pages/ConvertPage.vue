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
      :loading="loading"
     />

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
      class="q-mt-lg"
      @click="$router.push('/')"
    />

  </q-page>


</template>

<script setup>
import { useValute } from 'src/services/valute';

const {
  amount,
  from,
  to,
  result,
  loading,
  currencyOpt,
  convertCurrency
} = useValute();
</script>

<style scoped>

</style>
