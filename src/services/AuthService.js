import * as ApiUrls from '../constants/apiUrls';
import AuthenticatedRequestService from "./AuthenticatedRequestService";

export default class AuthService {
  constructor() {
    this.authenticatedRequestService = new AuthenticatedRequestService();
  }

  employeeLogin = (phoneNumber, pin) => {
    const postData = {
      phone: phoneNumber,
      pin: pin
    }
    return this.authenticatedRequestService
      .post(`${ApiUrls.EMPLOYEE_LOGIN_URL}`, postData)
      .then((response) => response.data);
  };

  employerLogin = (phoneNumber, pin) => {
    const postData = {
      phone: phoneNumber,
      pin: pin
    }
      return this.authenticatedRequestService
          .post(`${ApiUrls.EMPLOYER_LOGIN_URL}`, postData)
          .then((response) => response.data);
  };

  employeeRegister = (postData) => {

    return this.authenticatedRequestService
        .post(`${ApiUrls.EMPLOYEE_REGISTER}`, postData)
        .then((response) => response.data);
  };

  employerRegister = (postData) => {
    return this.authenticatedRequestService
        .post(`${ApiUrls.EMPLOYER_REGISTER}`, postData)
        .then((response) => response.data);
  };
}
