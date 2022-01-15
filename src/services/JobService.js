import * as ApiUrls from '../constants/apiUrls'
import BaseRequestService from './BaseRequestService'
import queryString from 'query-string'

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

  getAll = (qs) => {
    const query = queryString.stringify(qs)
    return this.baseRequestService
      .get(`${ApiUrls.JOB_URL}?${query}`)
      .then((response) => response.data)
  }
}
