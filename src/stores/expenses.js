import { ref, computed, watch } from 'vue'
import { useUser } from 'src/services/useUser'

const expenses = ref([])
const loading = ref(false)

export function useExpenses() {
  const { currentUser } = useUser()

  // Load troskove za trenutnog korisnika
  async function loadTrosak() {
    if (!currentUser.value) {
      expenses.value = []
      return
    }

    loading.value = true
    try {
      const res = await fetch(`http://localhost:3000/api/troskovi?userId=${currentUser.value.id}`)

      if (!res.ok) {
        const text = await res.text()
        console.error('Failed to fetch expenses:', text)
        expenses.value = []
      } else {
        expenses.value = await res.json()
      }
    } catch (err) {
      console.error('Error fetching expenses:', err)
      expenses.value = []
    } finally {
      loading.value = false
    }
  }

  // Add novi trosak
  async function addExpense({ amount, category, date }) {
    if (!currentUser.value) return

    try {
      const res = await fetch('http://localhost:3000/api/troskovi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.value.id,
          amount,
          category,
          date,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Failed to add expense:', text)
        return
      }

      await loadTrosak() // refresh after adding
    } catch (err) {
      console.error('Error adding expense:', err)
    }
  }

  // Auto-load whenever user changes
  watch(currentUser, loadTrosak, { immediate: true })

  const totalSpent = computed(() => expenses.value.reduce((sum, e) => sum + Number(e.amount), 0))

  const totalByCategory = computed(() =>
    expenses.value.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
      return acc
    }, {}),
  )

  return {
    expenses,
    loading,
    addExpense,
    loadTrosak,
    totalSpent,
    totalByCategory,
  }
}
