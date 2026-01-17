import { ref } from 'vue'

const currentUser = ref(null)

export function useUser() {
  function setUser(user) {
    currentUser.value = user
  }

  return {
    currentUser,
    setUser,
  }
}
