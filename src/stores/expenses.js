import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref([])
  const loading = ref(false)

  // Load expenses for a specific user
  async function loadExpensesForUser(userId) {
    try {
      const res = await fetch(`http://localhost:3000/api/Troskovi?userId=${userId}`)
      const data = await res.json()
      return Array.isArray(data) ? data : []
    } catch (err) {
      console.error(err)
      return []
    }
  }

  // Add expense
  async function addExpense({ amount, category, date, userId }) {
    if (!userId) return
    await fetch('http://localhost:3000/api/UnosTroskova', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, category, date }),
    })
  }

  return { expenses, loading, loadExpensesForUser, addExpense }
})
