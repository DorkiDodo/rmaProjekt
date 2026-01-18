<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useExpensesStore } from 'src/stores/expenses'
import ExpenseChart from 'src/components/ExpenseChart.vue'

const chartKey = ref(0)

const userStore = useUserStore()
const expensesStore = useExpensesStore()

const amount = ref(null)
const category = ref(null)
const date = ref(new Date().toISOString().slice(0, 10))
const categories = ['Hrana', 'Zabava', 'Shopping', 'Prijevoz', 'Ostalo']

const selectedUserId = ref(null)

// load users
onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/users')
  const users = await res.json()
  userStore.setUsers(users)

  if (users.length) {
    selectedUserId.value = users[0].id
  }
})

watch(selectedUserId, (id) => {
  const user = userStore.users.find((u) => u.id === id)
  if (user) userStore.setCurrentUser(user)
})

watch(selectedUserId, () => {
  chartKey.value++
})

// save expense
const saveExpense = async () => {
  if (!amount.value || !category.value || !selectedUserId.value) return

  await expensesStore.addExpense({
    userId: selectedUserId.value,
    amount: amount.value,
    category: category.value,
    date: date.value,
  })

  chartKey.value++

  amount.value = null
  category.value = null
}
</script>

<template>
  <q-page class="q-pa-sm q-gutter-md">
    <!-- USER SELECT -->
    <q-select
      v-model="selectedUserId"
      :options="userStore.users"
      option-label="name"
      option-value="id"
      emit-value
      map-options
      label="Odaberi korisnika"
      outlined
    />

    <expense-chart v-if="selectedUserId !== null" :user-id="selectedUserId" :key="chartKey" />

    <q-card class="q-mt-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">Dodaj trošak</div>

        <div class="column q-gutter-sm">
          <q-input v-model.number="amount" type="number" label="Iznos" outlined dense />

          <q-select v-model="category" :options="categories" label="Kategorija" outlined dense />

          <q-input v-model="date" type="date" label="Datum" outlined dense />
        </div>

        <q-btn
          label="Spremi trošak"
          color="primary"
          class="full-width q-mt-md"
          @click="saveExpense"
        />

        <q-btn class="col" label="Konverzija" color="secondary" @click="$router.push('/convert')" />
        <q-btn class="col" label="Investicije" color="secondary" @click="$router.push('/invest')" />
      </q-card-section>
    </q-card>
  </q-page>
</template>
