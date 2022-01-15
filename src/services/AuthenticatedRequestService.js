import axios from 'axios';
import * as ApiUrls from '../constants/apiUrls';
import BaseRequestService from './BaseRequestService';
import { getLoggedInUser, AUTH_USER_KEY } from '../utils/authUtils';

class AuthenticatedRequestService {
  constructor(accessToken) {
    let authUser = getLoggedInUser();
    if (!accessToken && authUser) {
      accessToken = authUser.accessToken;
    }

    this.failedRequests = [];
    this.isRefreshing = false;

    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
    this.processQueue = this.processQueue.bind(this);
    this.doRefreshToken = this.doRefreshToken.bind(this);
    this.handleRefreshTokenFailed = this.handleRefreshTokenFailed.bind(this);

    axios.defaults.baseURL = ApiUrls.BASE_API_URL;
    const instance = axios.create();
    instance.defaults.timeout = 1000 * 900; // in milliseconds
    instance.interceptors.response.use(this.handleSuccess, this.handleError);
    instance.defaults.headers.common = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    this.instance = instance;
  }

  handleSuccess(response) {
    return response;
  }

  handleError(error) {
    if (error.response) {
      const { response } = error;
      if (response.status === 503) {
        console.log('ERROR: service unavailable ');
        window.location.reload();
      } else if (response.status === 401) {
        console.log('Unauthenticated');

        // Push all request to the queue if the token is expired
        if (this.isRefreshing) {
          try {
            const token = new Promise((resolve, reject) => {
              this.failedRequests.push({ resolve, reject });
            });
            error.config.headers.Authorization = `Bearer ${token}`;
            return this.instance(error.config);
          } catch (e) {
            return e;
          }
        }
        this.isRefreshing = true;
        error.config.__isRetryRequest = true;

        return this.doRefreshToken()
          .then((accessToken) => {
            this.isRefreshing = false;
            console.log('Already got a new refresh token result');
            if (accessToken) {
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              this.processQueue(null, accessToken);
              return Promise.resolve(this.instance(error.config));
            } else {
              return Promise.reject({ ...error.response.data, code: error.response.status });
            }
          })
          .catch((e) => {
            this.isRefreshing = false;
            this.processQueue(e, null);
            this.handleRefreshTokenFailed();
          });
      } else {
        return Promise.reject({ ...error.response.data, code: error.response.status });
      }
    } else {
      return Promise.reject(error);
    }
  }

  doRefreshToken() {
    console.log('Do refresh new token');
    if (!localStorage.getItem(AUTH_USER_KEY)) {
      console.log('Unauthorized');
      throw 'Unauthorized';
    }
    let authUser = getLoggedInUser();
    let request = {
      grant_type: 'refresh_token',
      refresh_token: authUser.refreshToken
    };
    console.log('Sending request to fresh token');
    const baseRequestService = new BaseRequestService();
    return baseRequestService
      .post('/auth/refresh', request)
      .then((res) => {
        authUser = {
          ...authUser,
          accessToken: res.data.accessToken
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
        let accessToken = authUser.access_token;
        this.instance.defaults.headers.common = {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        };
        return accessToken;
      })
      .catch((error) => {
        throw error;
      });
  }

  handleRefreshTokenFailed() {
    console.error('Your session is expired. Please login again!');
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.reload();
  }

  processQueue(error, token = null) {
    console.log('processQueue: ' + this.failedRequests.length);
    this.failedRequests.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedRequests = [];
  }

  get(url) {
    console.log('get url : ' + url);
    return this.instance.get(url).catch((error) => {
      console.log('Have an error when perform get ' + url);
      return this.handleError(error);
    });
  }

  downloadFile(url) {
    console.log('get url : ' + url);
    return this.instance.get(url, { responseType: 'arraybuffer' }).catch((error) => {
      console.log('Have an error when perform get ' + url);
      return this.handleError(error);
    });
  }

  downloadGoogleDriveFile(ggDriveFileId) {
    const url = `${ApiUrls.BASE_API_URL}/cloud-storages/files/${ggDriveFileId}/download`;
    return this.instance
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => {
        const contentType = response.headers['content-type'];
        // eslint-disable-next-line no-undef
        const blob = new Blob([response.data], { type: contentType });
        return window.URL.createObjectURL(blob);
      })
      .catch((error) => {
        console.log('Have an error when perform get ' + url);
        return this.handleError(error);
      });
  }

  viewGoogleDriveFile(ggDriveFileId, contentFileType) {
    const url = `${ApiUrls.BASE_API_URL}/cloud-storages/files/${ggDriveFileId}/download`;
    this.instance
      .get(url, { responseType: 'blob' })
      .then((response) => {
        const blob = new Blob([response.data], { type: contentFileType });
        const fileURL = URL.createObjectURL(blob);
        //Open the URL on new Window
        window.open(fileURL);
      })
      .catch((error) => {
        console.log('Have an error when perform get ' + url);
        return this.handleError(error);
      });
  }

  post(url, body, options) {
    console.log('post url : ' + url);
    return this.instance.post(url, body, options).catch((error) => {
      console.log('Have an error when perform post ' + url);
      return this.handleError(error);
    });
  }

  put(url, body, options) {
    console.log('put url : ' + url);
    return this.instance.put(url, body, options).catch((error) => {
      console.log('Have an error when perform put ' + url);
      return this.handleError(error);
    });
  }


  delete(url) {
    console.log('delete url : ' + url);
    return this.instance.delete(url).catch((error) => {
      console.log('Have an error when perform delete ' + url);
      return this.handleError(error);
    });
  }
}

export default AuthenticatedRequestService;
