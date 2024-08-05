import CommonService from "~~/services/common.service";
import API_PATH from "~~/enums/API_PATH";

const useService = (path: API_PATH, onCustomResponse?: Function) => {
  return new CommonService(path, onCustomResponse);
};
export default useService;
