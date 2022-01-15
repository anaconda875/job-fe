import * as ApiUrls from '../constants/apiUrls'
import BaseRequestService from './BaseRequestService'

export default class JobService {
  constructor() {
    this.baseRequestService = new BaseRequestService()
  }

  createJob = (id, data) => {
    console.log(id)
    return this.baseRequestService
      .post(`${ApiUrls.JOB_URL}?User-Id=${id}`, data)
      .then((response) => response.data)
  }
}
