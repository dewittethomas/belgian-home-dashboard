import WasteCollectionApiGateway from "../gateways/WasteCollectionApiGateway.js";
import dayjs from "dayjs";

const WasteCollectionApiUseCase = {
    async getNextWasteCollections(zipCode, street, houseNumber) {
        const zipCodeId = await WasteCollectionApiGateway.fetchZipCodeId(zipCode);
        const streetId = await WasteCollectionApiGateway.fetchStreetId(street, zipCodeId);

        const fromDate = dayjs().format('YYYY-MM-DD');
        const untilDate = dayjs().add(7, 'day').format('YYYY-MM-DD');

        const data = await WasteCollectionApiGateway.fetchCollectionData(zipCodeId, streetId, houseNumber, fromDate, untilDate);

        const collections = data.filter(item => !(item.exception?.replacedBy))

        const types = collections.map(item => ({
            date: item.timestamp,
            name: item.fraction.name.nl
        }));

        return types;
    }
}

export default WasteCollectionApiUseCase;