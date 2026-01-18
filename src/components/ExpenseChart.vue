<script setup>
import { ref, watch, computed } from 'vue'
import { useExpensesStore } from 'src/stores/expenses'

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
})

const store = useExpensesStore()
const expenses = ref([])

async function load() {
  expenses.value = await store.loadExpensesForUser(props.userId)
}

watch(() => props.userId, load, { immediate: true })

const series = computed(() => [
  {
    name: 'Troškovi',
    data: expenses.value.map((e) => Number(e.amount)),
  },
])

const options = computed(() => ({
  xaxis: {
    categories: expenses.value.map((e) => e.date),
  },
}))
</script>

<template>
  <q-card>
    <q-card-section>
      <apexchart
        v-if="expenses.length"
        type="line"
        height="300"
        :series="series"
        :options="options"
      />
      <div v-else class="text-center q-pa-md">Nema troškova</div>
    </q-card-section>
  </q-card>
</template>
