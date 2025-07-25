import RequestBuilder from "../utils/requestBuilder.js";
import cacheManager from "../utils/cacheManager.js";

cacheManager.init();

const headers = { 'X-Consumer': 'recycleapp.be' };

const WasteCollectionApiGateway = {
    async fetchZipCodeId(zipCode) {
        const cacheKey = `Waste collection (zipCode): ${zipCode}`;
        const cachedData = await cacheManager.getData(cacheKey);

        if (cachedData) {
            return cachedData
        } else {
            const params = {
                'q': zipCode
            }

            const response = await RequestBuilder.get('https://api.fostplus.be/recyclecms/public/v1/zipcodes')
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            cacheManager.setData(cacheKey, response.data.items[0].id, 3600);

            return response.data.items[0].id;
        }
    },

    async fetchStreetId(street, zipCodeId) {
        const cacheKey = `Waste collection (street): ${street}`;
        const cachedData = await cacheManager.getData(cacheKey);
    
        if (cachedData) {
            return cachedData;
        } else {
            const params = {
                'q': street,
                'zipcodes': zipCodeId
            }

            const response = await RequestBuilder.post('https://api.fostplus.be/recyclecms/public/v1/streets')
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            cacheManager.setData(cacheKey, response.data.items[0].id, 3600);
            
            return response.data.items[0].id;
        }

    },

    async fetchCollectionData(zipCodeId, streetId, houseNumber, fromDate, untilDate) {
        const cacheKey = `Waste collection: ${streetId} ${houseNumber}`;
        const cachedData = await cacheManager.getData(cacheKey);
        
        if (cachedData) {
            return cachedData
        } else {
            const params = {
                'zipcodeId': zipCodeId,
                'streetId': streetId,
                'houseNumber': houseNumber,
                'fromDate': fromDate,
                'untilDate': untilDate,
                'size': 100
            };

            const response = await RequestBuilder.get(`https://api.fostplus.be/recyclecms/public/v1/collections`)
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            cacheManager.setData(cacheKey, response.data.items, 3600)

            return response.data.items;
        }
    }
};

export default WasteCollectionApiGateway;