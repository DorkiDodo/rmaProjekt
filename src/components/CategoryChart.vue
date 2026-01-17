<template>
  <q-card>
    <q-card-section>
      <apexchart
        type="pie"
        height="300"
        :options="options"
        :series="series"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useExpensesStore } from 'src/stores/expenses'

const store = useExpensesStore()

const series = computed(() =>
  Object.values(store.totalByCategory)
)

const options = computed(() => ({
  labels: Object.keys(store.totalByCategory)
}))
</script>
