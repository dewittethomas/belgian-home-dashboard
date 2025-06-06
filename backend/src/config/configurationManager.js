import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

class ConfigurationManager {
    static getServerConfig = {
        port: process.env.port,
    }

    static getDashboardName = process.env.DASHBOARD_NAME;

    static getWeatherConfig = {
        city: process.env.WEATHER_CITY.split(',')
    }
    
    static getWasteCollectionConfig = {
        zipCode: process.env.WASTE_COLLECTION_ZIP_CODE,
        street: process.env.WASTE_COLLECTION_STREET,
        houseNumber: process.env.WASTE_COLLECTION_HOUSE_NUMBER,
    }

    static getTrainConfig = {
        fromStation: process.env.TRAIN_STATION_FROM,
        toStation: process.env.TRAIN_STATION_TO.split(',')
    }

    static getTramConfig = {
        fromStation: process.env.TRAM_STOP_FROM,
        toStation: process.env.TRAM_STOP_TO.split(',')
    }

    static getBusConfig = {
        fromStation: process.env.BUS_STOP_FROM,
        toStation: process.env.BUS_STOP_TO.split(',')
    }

    static getFootballConfig = {
        team: process.env.FOOTBALL_TEAM.split(',')
    }
}

export default ConfigurationManager;