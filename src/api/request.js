import axios from "axios";
import { Message } from "element-ui";
import storage from "utils/storage";

const service = axios.create({
  baseURL: process.env.host
});
/** 请求过滤器 */
service.interceptors.request.use(
  request => {
    let userTokenInfo = storage.read("admin_UserInfo"); // 本地存在token就添加到请求头
    if (userTokenInfo) {
      request.headers.userToken = userTokenInfo.SessionId;
    }
    return request;
  },
  error => {
    Message({
      message: "请求超时!",
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
/**响应过滤器 */
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    let msg = "";
    if (error == "Error: Network Error") {
      msg = "当前网络不可用";
    } else if (error.response) {
      switch (error.response.status) {
        case 400:
          msg = "请求错误";
          break;
        case 401:
          msg = "请重新登录";
          storage.remove("admin_UserInfo");
          window.location.reload();
          break;
        case 403:
          msg = "拒绝访问";
          break;
        case 404:
          msg = "请求地址出错";
          break;
        case 408:
          msg = "请求超时";
          break;
        case 500:
          msg = "服务器内部错误";
          break;
        case 501:
          msg = "服务未实现";
          break;
        case 502:
          msg = "网关错误";
          break;
        case 503:
          msg = "服务不可用";
          break;
        case 504:
          msg = "网关超时";
          breaks;
        case 505:
          msg = "HTTP版本不受支持";
          break;
        default:
          msg = error.response.status;
          break;
      }
    }
    if (msg != "") {
      Message({
        message: msg,
        type: "error",
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);
export default service;
