import * as ApiUrls from '../constants/apiUrls'
import BaseRequestService from './BaseRequestService'

export default class AuthService {
  constructor() {
    this.baseRequestService = new BaseRequestService()
  }

  employeeLogin = (phoneNumber, pin) => {
    const postData = {
      phone: phoneNumber,
      pin: pin,
    }
    return this.baseRequestService
      .post(`${ApiUrls.EMPLOYEE_LOGIN_URL}`, postData)
      .then((response) => response.data)
  }

  employerLogin = (phoneNumber, pin) => {
    const postData = {
      phone: phoneNumber,
      pin: pin,
    }
    return this.baseRequestService
      .post(`${ApiUrls.EMPLOYER_LOGIN_URL}`, postData)
      .then((response) => response.data)
  }

  employeeRegister = (postData) => {
    return this.baseRequestService
      .post(`${ApiUrls.EMPLOYEE_REGISTER}`, postData)
      .then((response) => response.data)
  }

  employerRegister = (postData) => {
    return this.baseRequestService
      .post(`${ApiUrls.EMPLOYEER_REGISTER}`, postData)
      .then((response) => response.data)
  }
}
