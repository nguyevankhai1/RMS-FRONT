export default defineNuxtRouteMiddleware(async (to, from) => {
  const isAuthenticated = useAuth().isAuthenticated();
  if (to.path == "/auth" && to.query.token && to.query.expiresTime) {
    const expires = to.query.expiresTime.slice(0, 19);
    useAuth().setAuthCookie(to.query.token, expires);
    return navigateTo("/", { external: true });
  }
  if (!isAuthenticated && to.path != "/resetPassword" && to.path != "/") {
    return navigateTo(useAuth().redirectLoginSso(), { external: true });
  }
  const urlPermission = await usePermission().isPermission(to);
  if (!urlPermission && to.path != "/error" && to.path != "/") {
    return navigateTo("/error", { external: true });
  }
  navigateTo(to.path);
});
