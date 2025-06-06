import { executeWithDetailedHandling, NotFoundError } from "../utils/executionHandler.js";
import DateFormatter from "../utils/dateFormatter.js";
import RequestBuilder from "../utils/requestBuilder.js";
import languageSelector from '../utils/languageSelector.js';

const headers = { 'X-Consumer': 'recycleapp.be' };

class WasteCollectionFetcher {
    constructor(zipCode, street, houseNumber, days=14, lang='nl') {
        this.zipCode = zipCode;
        this.street = street;
        this.houseNumber = houseNumber;
        this.days = days;
        this.lang = lang;
    }

    async fetchZipCodeId(zipCode) {
        return executeWithDetailedHandling(async () => {
            const params = {
                'q': zipCode
            }

            const response = await RequestBuilder.get('https://api.fostplus.be/recyclecms/public/v1/zipcodes')
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            if (!response.success || !response.data.total) throw new NotFoundError("Error fetching ZIP Code ID.");

            return response.data.items[0].id;
        });
    }

    async fetchStreetId(street, zipCodeId) {
        return executeWithDetailedHandling(async () => {
            const params = {
                'q': street,
                'zipcodes': zipCodeId
            }

            const response = await RequestBuilder.post('https://api.fostplus.be/recyclecms/public/v1/streets')
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            if (!response.success || !response.data.total) throw new NotFoundError("Error fetching Street ID.");
            
            return response.data.items[0].id;
        });
    }

    async fetchAddressData(zipCode, street, houseNumber) {
        const zipCodeId = (await this.fetchZipCodeId(zipCode)).data;
        const streetId = (await this.fetchStreetId(street, zipCodeId)).data;
        
        return {
            'zipCodeId': zipCodeId,
            'streetId': streetId,
            'houseNumber': houseNumber
        };
    }

    async fetchCollectionData(zipCode, street, houseNumber, days) {
        const address = await this.fetchAddressData(zipCode, street, houseNumber);

        const fromDate = DateFormatter.format(DateFormatter.getDateTime());
        const untilDate = DateFormatter.format(DateFormatter.addDays(DateFormatter.getDateTime(), days));

        const params = {
            'zipcodeId': address.zipCodeId,
            'streetId': address.streetId,
            'houseNumber': address.houseNumber,
            'fromDate': fromDate,
            'untilDate': untilDate,
            'size': 100
        };

        return executeWithDetailedHandling(async () => {
            const response = await RequestBuilder.get(`https://api.fostplus.be/recyclecms/public/v1/collections`)
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            return response.data.items;
        });
    }

    extractCollectionData(item, lang) {
        const imageUrl = 'https://assets.recycleapp.be/';
        
        languageSelector(lang);

        const timestamp = DateFormatter.getDateTime(false, item.timestamp);
        
        return {
            'timestamp': timestamp,
            'date': DateFormatter.format(timestamp, 'DD-MM-YYYY'),
            'day': new DateFormatter(timestamp).getDay().weekDay[lang],
            'type': item.fraction.name[lang],
            'image': imageUrl + item.fraction.logo.regular['1x'],
            'color': item.fraction.color
        };
    }

    async fetchCollectionCalendar(zipCode, street, houseNumber, days, lang) {
        return executeWithDetailedHandling(async () => {
            const items = (await this.fetchCollectionData(zipCode, street, houseNumber, days)).data;
            const calendar = items.reduce((acc, item) => {
                const collectionData = this.extractCollectionData(item, lang);
                const existingDay = acc.find(entry => entry.date === collectionData.date);

                if (existingDay) {
                    existingDay.collections.push({
                        type: collectionData.type,
                        image: collectionData.image,
                        color: collectionData.color
                    });
                } else {
                    acc.push({
                        date: collectionData.date,
                        day: collectionData.day,
                        collections: [{
                            type: collectionData.type,
                            image: collectionData.image,
                            color: collectionData.color
                        }]
                    });
                }
                return acc;
            }, []);

            return calendar;
        });
    }

    async getCalendar() {
        return executeWithDetailedHandling(async () => {
            const calendar = (await this.fetchCollectionCalendar(this.zipCode, this.street, this.houseNumber, this.days, this.lang)).data;
            if (!calendar) throw new NotFoundError("Failed fetching Waste Collection Calendar.");
            return calendar;
        });
    }
}

export default WasteCollectionFetcher;