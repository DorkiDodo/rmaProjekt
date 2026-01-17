<template>
  <q-card>
    <q-card-section>
      <div v-if="store.expenses.value.length">
        <apexchart type="line" height="300" :options="options" :series="series" />
      </div>
      <div v-else class="text-center q-pa-md">Nema troškova za prikaz</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useExpenses } from 'src/stores/expenses'

const store = useExpenses()

const series = computed(() => [
  {
    name: 'Troškovi',
    data: store.expenses.value.map((e) => Number(e.amount) || 0),
  },
])

const options = computed(() => ({
  chart: { id: 'expenses' },
  xaxis: { categories: store.expenses.value.map((e) => e.date || '') },
}))
</script>
