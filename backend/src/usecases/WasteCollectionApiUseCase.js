import WasteCollectionApiGateway from "../gateways/WasteCollectionApiGateway.js";
import getResults from "../utils/resultHandler.js";

import dayjs from "dayjs";

const WasteCollectionApiUseCase = {
    async getNextWasteCollections(zipCode, street, houseNumber) {
        const results = 3;

        const zipCodeId = await WasteCollectionApiGateway.fetchZipCodeId(zipCode);
        const streetId = await WasteCollectionApiGateway.fetchStreetId(street, zipCodeId);

        const fromDate = dayjs().format('YYYY-MM-DD');
        const untilDate = dayjs().add(7, 'day').format('YYYY-MM-DD');

        const data = await WasteCollectionApiGateway.fetchCollectionData(zipCodeId, streetId, houseNumber, fromDate, untilDate);

        const collections = data
            .filter(item => !(item.exception?.replacedBy))
            .reduce((acc, item) => {
                const date = dayjs(item.timestamp).format('DD-MM');
                const type = item.fraction.name.nl;

                if (acc[date]) {
                    acc[date].types.push(type)
                } else {
                    acc[date] = { types: [type] };
                }

                return acc;
            }, {});

        const groupedCollections = Object.keys(collections).map(key => ({
            date: key,
            type: collections[key].types.sort((a,b) => a.length - b.length).join(', ')
        }));

        return getResults(groupedCollections, results);
    }
}

export default WasteCollectionApiUseCase;