import axios from 'axios'
import * as ApiUrls from '../constants/apiUrls'

class BaseRequestService {
  constructor() {
    console.log(`AuthService: ${ApiUrls.BASE_API_URL}`)

    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleError = this.handleError.bind(this)

    axios.defaults.baseURL = ApiUrls.BASE_API_URL
    const instance = axios.create()
    instance.interceptors.response.use(this.handleSuccess, this.handleError)
    this.instance = instance
  }

  handleSuccess(response) {
    return response
  }

  handleError(error) {
    console.log(JSON.stringify(error, null, 2))
    if (error.response) {
      return Promise.reject({ ...error.response.data, code: error.response.status })
    } else {
      return Promise.reject(error)
    }
  }

  get(url) {
    console.log('auth get url : ' + url)
    return this.instance.get(url).catch((error) => {
      console.log('Have an error when perform get ' + url)
      return this.handleError(error)
    })
  }

  post(url, body) {
    console.log('auth post url : ' + url)
    return this.instance.post(url, body).catch((error) => {
      console.log('Have an error when perform post ' + url)
      return this.handleError(error)
    })
  }

  put(url, body) {
    console.log('auth put url : ' + url)
    return this.instance.put(url, body).catch((error) => {
      console.log('Have an error when perform put ' + url)
      return this.handleError(error)
    })
  }

  delete(url) {
    console.log('delete url : ' + url)
    return this.instance.delete(url).catch((error) => {
      console.log('Have an error when perform delete ' + url)
      return this.handleError(error)
    })
  }
}

export default BaseRequestService
