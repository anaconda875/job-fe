import * as ApiUrls from '../constants/apiUrls'
import BaseRequestService from './BaseRequestService'

export default class JobService {
  constructor() {
    this.baseRequestService = new BaseRequestService()
  }

  createJob = (data) => {
    return this.baseRequestService
      .post(`${ApiUrls.JOB_URL}`, data)
      .then((response) => response.data)
  }
}
