export default defineNuxtRouteMiddleware((to, from) => {
  // your login token cookie
  const token = useCookie("auth_token") 

  // Public pages — allow without login
  const publicRoutes = ["/login", "/register", "/forgot-password"]

  if (token.value && publicRoutes.includes(to.path)) {
    return navigateTo("/")
  }

  if (publicRoutes.includes(to.path)) {
    return
  }

  // redirect to login
  if (!token.value) {
    return navigateTo("/login")
  }
})
