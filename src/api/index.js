// import qs from 'qs'
import service from "./request";
import md5 from "js-md5";
import { parseTime } from "utils";

export default {
  /**
   * 登录
   */
  login(LoginName, password) {
    let url = "user/Login";
    const loginSalt = "FJKliJNVjkfdskrwoNKVNDKjfodiFJDKljioJFKDL"; //登录签名
    const valid = parseTime(new Date(), "{y}{m}{d}{h}{i}{s}");
    let UserLogin = {
      LoginName: LoginName,
      Password: password,
      Mac: "",
      Valid: valid,
      Sign: md5(LoginName + password + valid + loginSalt)
    };
    return service.post(url, UserLogin);
  },
  getEmployeeList(pageIndex, pageSize) {
    let url = "Employee/GetList/" + pageIndex + "_" + pageSize;
    return service.get(url);
  },
  getEmployeeById(employeeId) {
    let url = "Employee/GetById/" + employeeId;
    return service.get(url);
  },
  putEmployee(employee) {
    let url = "Employee/post";
    return service.post(url, employee);
  },
  deleteEmployeeById(employeeId) {
    let url = "Employee/Delete?id=" + employeeId;
    return service.delete(url);
  },
  getCustomerList(companyName, contactName, phone, pageIndex, pageSize) {
    let url =
      "Customer/GetList?companyName=" +
      companyName +
      "&contactName=" +
      contactName +
      "&phone=" +
      phone +
      "&pageIndex=" +
      +pageIndex +
      "&pageSize=" +
      pageSize;
    return service.get(url);
  },
  getCustomerById(customerId) {
    let url = "Customer/GetById/" + customerId;
    return service.get(url);
  },
  putCustomer(Customer) {
    let url = "Customer/post";
    return service.post(url, Customer);
  },
  deleteCustomerById(customerId) {
    let url = "Customer/Delete?id=" + customerId;
    return service.delete(url);
  },
  getCategoryDrop() {
    let url = "Category/GetDropList";
    return service.get(url);
  },
  getSupplierDrop() {
    let url = "Supplier/GetDropList";
    return service.get(url);
  },
  getProductList(
    productName,
    supplierID,
    categoryID,
    discontinued,
    pageIndex,
    pageSize
  ) {
    let url =
      "Product/GetList?productName=" +
      productName +
      "&supplierID=" +
      supplierID +
      "&categoryID=" +
      categoryID +
      "&discontinued=" +
      discontinued +
      "&pageIndex=" +
      +pageIndex +
      "&pageSize=" +
      pageSize;
    return service.get(url);
  },
  getProductById(ProductId) {
    let url = "Product/GetById/" + ProductId;
    return service.get(url);
  },
  putProduct(product) {
    let url = "Product/post";
    return service.post(url, product);
  },
  deleteProductById(productId) {
    let url = "Product/Delete?id=" + productId;
    return service.delete(url);
  },
  getOrderList(
    customerName,
    shipName,
    shipperID,
    orderStartDate,
    orderEndDate,
    pageIndex,
    pageSize
  ) {
    let url =
      "Order/GetList?customerName=" +
      customerName +
      "&shipName=" +
      shipName +
      "&shipperID=" +
      shipperID +
      "&orderStartDate=" +
      orderStartDate +
      "&orderEndDate=" +
      orderEndDate +
      "&pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize;
    return service.get(url);
  },
  /**
   * 上传文件
   */
  async fileUpload(image) {
    const url = "Employee/UploadAvatar";
    let formData = new FormData();
    formData.append("file", image);
    return await service.post(url, formData);
  }
};
