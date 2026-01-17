<template>
  <q-page padding>
    <expense-chart class="q-mb-md" />

    <!-- User selection -->
    <q-select
      v-model="selected"
      :options="users"
      option-label="name"
      option-value="id"
      label="Odaberi korisnika"
      outlined
      @update:model-value="onSelect"
      class="q-mb-md"
    />

    <!-- Dodaj trošak card -->
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">Dodaj trošak</div>

        <q-input v-model.number="amount" type="number" label="Iznos" outlined class="q-mb-sm" />

        <q-select
          v-model="category"
          :options="categories"
          label="Kategorija"
          outlined
          class="q-mb-sm"
        />

        <q-input v-model="date" type="date" outlined label="Datum" class="q-mb-md" />

        <q-btn label="Spremi trošak" color="primary" class="full-width" @click="saveExpense" />
      </q-card-section>
    </q-card>

    <!-- Navigation buttons -->
    <div class="row q-col-gutter-md q-mt-lg">
      <q-btn class="col" label="Konverzija" color="secondary" @click="$router.push('/convert')" />
      <q-btn
        class="col"
        label="Pregled troškova"
        color="accent"
        @click="$router.push('/summary')"
      />
      <q-btn class="col" label="Investicije" color="secondary" @click="$router.push('/invest')" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useExpenses } from 'src/stores/expenses'
import { useUser } from 'src/services/useUser'
import ExpenseChart from 'src/components/ExpenseChart.vue'

const users = ref([])
const selected = ref(null)
const { setUser } = useUser()
const store = useExpenses()

const amount = ref(null)
const category = ref(null)
const date = ref(new Date().toISOString().slice(0, 10))

const categories = ['Hrana', 'Zabava', 'Shopping', 'Prijevoz', 'Ostalo']

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/users')
    if (!res.ok) throw new Error('Failed to fetch users')
    users.value = await res.json()
  } catch (err) {
    console.error('Error loading users:', err)
  }
})

function onSelect(userId) {
  const user = users.value.find((u) => u.id === userId)
  setUser(user)
}

function saveExpense() {
  if (!amount.value || !category.value) return
  store.addExpense({
    amount: amount.value,
    category: category.value,
    date: date.value,
  })
  amount.value = null
  category.value = null
}
</script>
