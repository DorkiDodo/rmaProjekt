import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const currentUser = ref(null)

  function setUsers(userList) {
    users.value = userList
  }

  function setCurrentUser(user) {
    currentUser.value = user
    console.log('Current user set:', currentUser.value)
  }

  return { users, currentUser, setUsers, setCurrentUser }
})
