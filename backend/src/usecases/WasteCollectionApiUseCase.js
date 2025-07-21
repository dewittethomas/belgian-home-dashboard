import WasteCollectionApiGateway from "../gateways/WasteCollectionApiGateway.js";
import dayjs from "dayjs";

const WasteCollectionApiUseCase = {
    async getNextWasteCollection(zipCode, street, houseNumber) {
        const zipCodeId = await WasteCollectionApiGateway.fetchZipCodeId(zipCode);
        const streetId = await WasteCollectionApiGateway.fetchStreetId(street, zipCodeId);

        const fromDate = dayjs().format('YYYY-MM-DD');
        const untilDate = dayjs().add(7, 'day').format('YYYY-MM-DD');

        const data = await WasteCollectionApiGateway.fetchCollectionData(zipCodeId, streetId, houseNumber, fromDate, untilDate);

        return data;
    }
}

export default WasteCollectionApiUseCase;