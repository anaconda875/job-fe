import * as ApiUrls from '../constants/apiUrls';
import AuthenticatedRequestService from "./AuthenticatedRequestService";

export default class MasterDataService {
  constructor() {
    this.authenticatedRequestService = new AuthenticatedRequestService();
  }

  experienceLevels = () => {
    return this.authenticatedRequestService
      .get(`${ApiUrls.EPX_LEVELS}`)
      .then((response) => response.data);
  };

  jobCategories = () => {
    return this.authenticatedRequestService
        .get(`${ApiUrls.CATS}`)
        .then((response) => response.data);
  };


}
