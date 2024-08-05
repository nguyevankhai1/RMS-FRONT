import API_PATH from "~~/enums/API_PATH";

export default class CommonService {
  public path: string;
  public onCustomResponse?: Function;
  constructor(path: string, onCustomResponse?: Function) {
    this.path = path;
    this.onCustomResponse = onCustomResponse;
  }

  public async getByPage(params = {}) {
    const { data, error, pending } = await useAPI({
      path: `${this.path}/get/list` as API_PATH,
    })._get(params);
    return data;
  }

  public async finBy(params = {}) {
    const { data, error, pending } = await useAPI({
      path: `${this.path}/get` as API_PATH,
    })._get(params);
    return data;
  }

  public async finById(id: string) {
    const { data, error, pending } = await useAPI({
      path: `${this.path}/get` as API_PATH,
      onCustomResponse: this.onCustomResponse,
    })._get({ id });
    return data;
  }

  public async create(body: {}) {
    const { data, error, pending } = await useAPI({
      path: `${this.path}/create` as API_PATH,
    })._post(body);
    return data;
  }

  public async update(body: {}) {
    const { data, error, pending } = await useAPI({
      path: `${this.path}/update` as API_PATH,
    })._put(body);
    return data;
  }

  public async delete(id: string | number, params?: {}) {
    const { data, error, pending } = await useAPI({
      path: `${this.path}/delete` as API_PATH,
    })._delete({ ...params, id });
    return data;
  }

  public async getForSelect(params: any = {}, path: string = "get/list") {
    const { data, error, pending } = await useAPI({
      path: `${this.path}/${path}` as API_PATH,
    })._get(params);
    return data;
  }

  public async getList(params: any = {}, path: string = "get") {
    const { data, error, pending } = await useAPI({
      path: `${this.path}/${path}` as API_PATH,
    })._get(params);
    return data;
  }
}
