enum API_PATH {
  AUTH_TOKEN = "/auth/token", // api get token
  AUTH_MENU = "/auth/menu", // api get menu
  AUTH_ME = "/auth/me", // api get infor account login
  AUTH_REGISTER = "/auth/register", // api get menu
  AUTH_LOGOUT = "/auth/logout", // api logout
  AUTH_FORGET_PASSWORD = "/auth/forgetPassword", // api get otp email for reset password
  AUTH_RESET_PASSWORD = "/auth/reset/password", // api reset password
  AUTH_CHANGE_PASSWORD = "/auth/change/password", // api change password
  FILE_UPLOAD = "/file/upload", // api upload file, method POST
  FILE_DOWNLOAD = "/file/download", // api download file, method GET
  USER = "/user",
  USER_CHANGE_PASSWORD = "/user/change/password",
  USER_APPLICATION = "/user/application",
  USER_PERMISSION = "/user/permission",
  RESOURCESBYROLEIDS = "resourcesByRoleIds",
  PROVINCE = "/province",
  AREA = "/area",
  COMMUNE = "/commune",
  DISTRICT = "/district",
  COUNTRY = "/country",
  REGION = "/region",
  ORGANIZATION = "/organization",
  DEPARTMENT = "/department",
  APPLICATION = "/application",
  ROLE = "/application/role",
  RESOURCE = "/application/resource",
  CATEGORY = "/application/category",
  ROLE_CONTROLLER = "/role",
  SPECIALIZE = "/specialize",
  USER_ZONE = "/user/zone",
  USER_ABILITY = "/user/ability",
  EXTEND = "/extend",
  PROVIDER = "/provider",
  ETHNICITY = "/ethnic",
  APIKEYS_CONFIG = "/apikeys",
}

export default API_PATH;
