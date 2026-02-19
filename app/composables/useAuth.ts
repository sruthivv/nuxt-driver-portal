export const useAuth = () => {
  const user = useState("user", () => null)

  const fetchUser = async () => {
    try {
      const response = await $fetch("/api/me")

      user.value = response?.data?.driver ?? null

    } catch (error) {
      user.value = null
    }
  }

  return { user, fetchUser }
}
