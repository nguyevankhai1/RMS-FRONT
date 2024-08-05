import { useMeStore } from "~~/store/me";
import useAuthUser from "./useAuthUser";
import useNotify from "./useNotify";
import API_PATH from "~~/enums/API_PATH";
const useAuth = () => {
  const authUser = useAuthUser();
  const setUser = (user: any) => {
    authUser.value = user;
  };

  const setAuthCookie = (token: any, expiresTime: any) => {
    const authorization = useCookie<string>("Authorization", {
      expires: new Date(expiresTime),
    });
    authorization.value = "Bearer " + token;
  };
  const getToken = () => {
    return useCookie<string>("Authorization");
  };
  const isAuthenticated = () => {
    const authorization = getToken();

    if (authorization.value == undefined || authorization.value == null)
      return false;
    return true;
  };
  const register = async (
    name: string,
    account: string,
    email: string,
    password: string
  ) => {
    const { data, error }: any = await useAPI({
      path: API_PATH.AUTH_REGISTER,
    })._post({ name, account, email, password });
    if (error.value || data.value.statusCode != "200") {
      useNotify("danger", data.value.message).show();
      return false;
    }
    if (data) {
      return data.value;
    }
    return null;
  };
  const login = async (
    account: string,
    password: string,
    rememberMe: boolean
  ) => {
    const { data, error }: any = await useAPI({
      path: API_PATH.AUTH_TOKEN,
    })._post({ account, password, rememberMe });
    if (error.value || data.value.statusCode != "200") {
      // error
      useNotify("danger", error.value || "Đăng nhập thất bại").show();
      return false;
    }
    if (data) {
      // success
      setAuthCookie(data.value.data.token, data.value.data.expiresTime);
      return authUser;
    }
    return null; // undefine response
  };

  async function logout() {
    const { data }: any = await useAPI({
      path: API_PATH.AUTH_LOGOUT,
    })._put();
    if (data) {
      const authCookie = useCookie("Authorization");
      authCookie.value = null;
      window.open(redirectToLogoutPage(), "_self");
    }
    return undefined;
  }

  const forgetPassword = async (string: string) => {
    const { data, error }: any = await useAPI({
      path: API_PATH.AUTH_FORGET_PASSWORD,
    })._post(string);
    if (error.value || data.value.statusCode != "200") {
      useNotify("danger", data.value.message).show();
      return false;
    }
    if (data) {
      return data.value;
    }
    return null;
  };

  const resetPassword = async (
    account: string,
    password: string,
    token: string
  ) => {
    const { data, error }: any = await useAPI({
      path: API_PATH.AUTH_RESET_PASSWORD,
    })._put({ account, password, token });
    if (error.value || data.value.statusCode != "200") {
      useNotify("danger", data.value.message).show();
      return false;
    }
    if (data) {
      return data.value;
    }
    return null;
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    const { data, error }: any = await useAPI({
      path: API_PATH.AUTH_CHANGE_PASSWORD,
    })._put({ oldPassword, newPassword });
    if (error.value || data.value.statusCode != "200") {
      useNotify("danger", data.value.message).show();
      return false;
    }
    if (data) {
      return data.value;
    }
    return null;
  };

  const me = async () => {
    const { setUser } = useMe();
    const { setPermission } = usePermission();
    const meStore = useMeStore();
    const { setMe } = meStore;
    const { setRole } = useUserRole();
    const { setZone } = useUserZone();
    const { data }: any = await useAPI({ path: API_PATH.AUTH_ME })._get({
      fields: ["apis,zone"],
    });
    if (data.value) {
      if (data.value.statusCode == "200" && data.value.data) {
        setMe(data.value.data.info);
        setUser(data.value.data.info);
        setPermission(data.value.data.apis);
        setRole(data.value.data.roles);
        setZone(data.value.data.zone);
      }
      return data.value;
    }
    return null;
  };

  const redirectLoginSso = () => {
    const config = useRuntimeConfig();
    const BASE_URL = `${window.location.origin}/auth`;
    return `${config.public.BASE_URL_SSO}/login?continue=${BASE_URL}&appId=${config.public.APP_ID}`;
  };

  const redirectToLogoutPage = () => {
    const config = useRuntimeConfig();
    const BASE_URL = `${window.location.origin}/auth`;
    return `${config.public.BASE_URL_SSO}/logout?continue=${BASE_URL}&appId=${config.public.APP_ID}`;
  };

  return {
    register,
    login,
    logout,
    forgetPassword,
    resetPassword,
    changePassword,
    isAuthenticated,
    getToken,
    me,
    redirectLoginSso,
    redirectToLogoutPage,
    setAuthCookie,
  };
};
export default useAuth;
