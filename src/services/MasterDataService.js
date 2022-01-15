import * as ApiUrls from '../constants/apiUrls';
import BaseRequestService from "./BaseRequestService";

export default class MasterDataService {
    constructor() {
        this.baseRequestService = new BaseRequestService()
    }

    experienceLevels = () => {
        return this.baseRequestService
            .get(`${ApiUrls.EPX_LEVELS}`)
            .then((response) => response.data);
    };

    jobCategories = () => {
        return this.baseRequestService
            .get(`${ApiUrls.CATS}`)
            .then((response) => response.data);
    };


}
