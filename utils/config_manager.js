import 'dotenv/config';

class ConfigurationManager {
    static getDevMode = process.env.DEV_MODE == 1 ? true : false;

    static getLanguage = {
        language: process.env.LANGUAGE
    }
    
    static getDashboardConfig = {
        name: process.env.DASHBOARD_NAME
    }

    static getWasteCollectionConfig = {
        zipCode: process.env.WASTE_COLLECTION_ZIP_CODE,
        street: process.env.WASTE_COLLECTION_STREET,
        houseNumber: process.env.WASTE_COLLECTION_HOUSE_NUMBER
    }

    static getWeatherConfig = {
        city: process.env.WEATHER_CITY
    }

    static getTrainConfig = {
        from: process.env.TRAIN_STATION_FROM,
        to: process.env.TRAIN_STATION_TO.split(", ")
    }

    static getFootballConfig = {
        team: process.env.FOOTBALL_TEAM
    }
}

export default ConfigurationManager;