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

    <q-card class="q-mt-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">Dodaj štednju</div>

        <div class="column q-gutter-sm">
          <q-input
            v-model.number="y"
            type="number"
            label="Iznos"
            outlined
            dense
          />

          <q-select
            v-model="category"
            :options="categories"
            label="Kategorija"
            outlined
            dense
          />

          <q-input
            v-model="date"
            type="date"
            label="Datum"
            outlined
            dense
          />
        </div>

        <q-btn
          label="Spremi štednju"
          color="primary"
          class="full-width q-mt-md"
          @click="saveSaving"
        />
      </q-card-section>
    </q-card>


     <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Ukupna štednja</div>
        <div class="text-h4">{{ totalSavings }} €</div>
      </q-card-section>
    </q-card>


  </q-page>



</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useUserStore } from 'src/stores/user'

const userStore = useUserStore()

const amount = ref(null)
const category = ref(null)
const date = ref(new Date().toISOString().slice(0, 10))
const categories = ['Štednja', 'Investicija', 'Fond', 'Ostalo']

const selectedUserId = ref(null)
const savings = ref([])

// load users
onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/users')
  const users = await res.json()
  userStore.setUsers(users)

  if (users.length) {
    selectedUserId.value = users[0].id
  }
})

// load savings for user
async function loadSavings(userId) {
  const res = await fetch(`http://localhost:3000/api/Stednja?userId=${userId}`)
  savings.value = await res.json()
}

watch(selectedUserId, (id) => {
  const user = userStore.users.find((u) => u.id === id)
  if (user) userStore.setCurrentUser(user)

  if (id) loadSavings(id)
})

// total savings
const totalSavings = computed(() => {
  return savings.value.reduce((sum, s) => sum + Number(s.amount), 0).toFixed(2)})

// save saving
const saveSaving = async () => {
  if (!amount.value || !category.value || !selectedUserId.value) return

  const res = await fetch('http://localhost:3000/api/UnosStednje', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: selectedUserId.value,
      amount: amount.value,
      category: category.value,
      date: date.value
    })
  })

  if (res.ok) {
    amount.value = null
    category.value = null

    // refresh total savings after saving
    loadSavings(selectedUserId.value)
  }
}
</script>

