import RequestBuilder from "../utils/requestBuilder.js";

const headers = { 'X-Consumer': 'recycleapp.be' };

const WasteCollectionApiGateway = {
    async fetchZipCodeId(zipCode) {
        const params = {
            'q': zipCode
        }

        const response = await RequestBuilder.get('https://api.fostplus.be/recyclecms/public/v1/zipcodes')
                        .setParams(params)
                        .setHeaders(headers)
                        .send();

        return response.data.items[0].id;
    },

    async fetchStreetId(street, zipCodeId) {
        const params = {
            'q': street,
            'zipcodes': zipCodeId
        }

        const response = await RequestBuilder.post('https://api.fostplus.be/recyclecms/public/v1/streets')
                        .setParams(params)
                        .setHeaders(headers)
                        .send();

        
        return response.data.items[0].id;
    },

    async fetchCollectionData(zipCodeId, streetId, houseNumber, fromDate, untilDate) {
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

        return response.data.items;
    }
};

export default WasteCollectionApiGateway;