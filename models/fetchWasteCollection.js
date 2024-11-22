import { executeWithDetailedHandling, NotFoundError } from "../helpers/execute_helper.js";
import DateFormatter from "../utils/date_formatter.js";
import RequestBuilder from "../utils/request_builder.js";
import languageSelector from '../utils/language_selector.js';

const headers = { 'X-Consumer': 'recycleapp.be' };

class WasteCollectionFetcher {
    constructor(zipCode, street, houseNumber) {
        this.zipCode = zipCode;
        this.street = street;
        this.houseNumber = houseNumber;
    }

    async fetchZipCodeId(zipCode) {
        return await executeWithDetailedHandling(async () => {
            const params = {
                'q': zipCode
            }

            const response = await RequestBuilder.get('https://api.fostplus.be/recyclecms/public/v1/zipcodes')
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            if (!response.success || !response.data.total) {
                throw new NotFoundError("Error fetching ZIP Code ID's.");
            }

            return { data: response.data.items[0].id };
        });
    }

    async fetchStreetId(street, zipCodeId) {
        return await executeWithDetailedHandling(async () => {
            const params = {
                'q': street,
                'zipcodes': zipCodeId
            }

            const response = await RequestBuilder.post('https://api.fostplus.be/recyclecms/public/v1/streets')
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            if (!response.success || !response.data.total) {
                throw new NotFoundError("Error fetching Street ID's.");
            }
            
            return { data: response.data.items[0].id };
        });
    }

    async fetchAddressData(zipCode, street, houseNumber) {
        const zipCodeId = (await this.fetchZipCodeId(zipCode)).data;
        const streetId = (await this.fetchStreetId(street, zipCodeId)).data;
        
        const response = {
            'zipCodeId': zipCodeId,
            'streetId': streetId,
            'houseNumber': houseNumber
        }

        return response;
    }

    async fetchCollectionData(zipCode, street, houseNumber, days, size=100) {
        const address = await this.fetchAddressData(zipCode, street, houseNumber);

        const fromDate = DateFormatter.format(DateFormatter.getDateTime());
        const untilDate = DateFormatter.format(DateFormatter.addDays(DateFormatter.getDateTime(), days));

        const params = {
            'zipcodeId': address.zipCodeId,
            'streetId': address.streetId,
            'houseNumber': address.houseNumber,
            'fromDate': fromDate,
            'untilDate': untilDate,
            'size': size
        };

        return executeWithDetailedHandling(async () => {
            const response = await RequestBuilder.get(`https://api.fostplus.be/recyclecms/public/v1/collections`)
                            .setParams(params)
                            .setHeaders(headers)
                            .send();

            return { data: response.data.items };
        });
    }

    async extractCollectionData(item, lang) {
        return executeWithDetailedHandling(async () => {
            const imageUrl = 'https://assets.recycleapp.be/';

            if (!item || item.type !== 'collection') {
                throw new NotFoundError("Error fetching item.");
            }

            languageSelector(lang);

            const timestamp = DateFormatter.getDateTime(false, item.timestamp);

            const extraction = {
                'timestamp': timestamp,
                'date': DateFormatter.format(timestamp, 'DD-MM-YYYY'),
                'day': new DateFormatter(timestamp).getDay().weekDay[lang],
                'type': item.fraction.logo.name[lang],
                'description': item.fraction.name[lang],
                'image': imageUrl + item.fraction.logo.regular['1x'],
                'color': item.fraction.color
            }

            return { data: extraction };
        });
    }

    async fetchCollectionCalendar(zipCode, street, houseNumber, days, lang) {
        return executeWithDetailedHandling(async () => {
            const items = (await this.fetchCollectionData(zipCode, street, houseNumber, days)).data;

            const calendar = await Promise.all(
                items.map(async (item) => (await this.extractCollectionData(item, lang)).data)
            );

            return { data: calendar };
        });
    }

    async getCalendar(days=7, lang='nl') {
        return executeWithDetailedHandling(async () => {
            const calendar = (await this.fetchCollectionCalendar(this.zipCode, this.street, this.houseNumber, days, lang)).data;

            if (!calendar) {
                throw new NotFoundError("Failed fetching Waste Collection Calendar.");
            }

            return { data: calendar };
        });
    }
}

export default WasteCollectionFetcher;