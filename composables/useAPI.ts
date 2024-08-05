import API_PATH from "~~/enums/API_PATH";

export const useBaseApi = () => {
  const { $config } = useNuxtApp();
  return $config.public.apiBase;
};

type Config = {
  path: API_PATH;
  onCustomRequest?: Function;
  onCustomRequestError?: Function;
  onCustomResponse?: Function;
  onCustomResponseError?: Function;
};
const useAPI = ({
  path,
  onCustomRequest,
  onCustomRequestError,
  onCustomResponse,
  onCustomResponseError,
}: Config) => {
  const auth = useAuth().getToken();
  const headers = {
    Authorization: auth.value,
  };
  const _post = async (d: any = {}) => {
    const { data, pending, error, refresh } = await useFetch(path, {
      method: "POST",
      baseURL: useBaseApi(),
      onRequest,
      onRequestError,
      onResponse,
      onResponseError,
      server: true,
      body: d,
    });
    return { data, pending, error, refresh };
  };

  const _get = async (params: any = {}) => {
    const { data, pending, error, refresh } = await useFetch(path, {
      method: "GET",
      params: params,
      baseURL: useBaseApi(),
      onRequest,
      onRequestError,
      onResponse,
      onResponseError,
      server: true,
    });
    return { data, pending, error, refresh };
  };

  const _put = async (b: any = {}) => {
    const { data, pending, error, refresh } = await useFetch(path, {
      method: "PUT",
      body: b,
      baseURL: useBaseApi(),
      onRequest,
      onRequestError,
      onResponse,
      onResponseError,
      server: true,
    });
    return { data, pending, error, refresh };
  };

  const _delete = async (params: any = {}) => {
    const { data, pending, error, refresh } = await useFetch(path, {
      method: "DELETE",
      params: params,
      baseURL: useBaseApi(),
      onRequest,
      onRequestError,
      onResponse,
      onResponseError,
      server: true,
    });
    return { data, pending, error, refresh };
  };

  const onRequest = ({ request, options }) => {
    // Set the request headers
    const i18n = useCookie("i18n_redirected");
    options.headers = options.headers || {};
    if (onCustomRequest) onCustomRequest({ request, options });
    else if (useAuth().isAuthenticated())
      options.headers.Authorization = auth.value;
    options.headers["X-LANGUAGE"] = i18n.value ? i18n.value : "vi";
  };

  const onRequestError = ({ request, options, error }) => {
    // Handle the request errors
    if (onCustomRequestError) onCustomRequestError({ request, options, error });
  };
  const onResponse = ({ request, response, options }) => {
    // Process the response data
    if (onCustomResponse) {
      return onCustomResponse({ request, response, options });
    }

    if (response._data.statusCode == "200") return response._data.data;
    else if (response._data.statusCode == "401") return useAuth().logout();
    else {
      useNotify("danger", response._data.message).show();
      return response._data.data;
    }
  };

  const onResponseError = ({ request, response, options }) => {
    // Handle the response errors
    if (onCustomResponseError)
      return onCustomResponseError({ request, response, options });
  };
  return {
    _post,
    _get,
    _put,
    _delete,
  };
};
export default useAPI;
