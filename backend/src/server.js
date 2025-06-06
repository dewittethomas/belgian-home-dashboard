import Config from "./config/configurationManager.js";

import WeatherFetcher from "./api/fetchWeather.js";
import WasteCollectionFetcher from "./api/fetchWasteCollection.js";
import BasketballFetcher from "./api/fetchFootball.js";
import BusFetcher from "./api/fetchTram.js";
import DateFormatter from "./utils/dateFormatter.js";
import TrainScheduleFetcher from "./api/fetchTrain.js";

// const weather = new WeatherFetcher(Config.getWeatherConfig.city[0]);
// console.log(await weather.getCurrent());

// const waste = new WasteCollectionFetcher(Config.getWasteCollectionConfig.zipCode, Config.getWasteCollectionConfig.street, Config.getWasteCollectionConfig.houseNumber);
// console.log((await waste.getCalendar()).data);

// const football = new BasketballFetcher('Ajax');
// // // const last = (await football.fetchLastMatches(2900));
// // // console.log(last);
// console.log((await football.getStatistics()))


// const bus = new BusFetcher(Config.getTramConfig.fromStation, Config.getTramConfig.toStation[0])
// console.log(await bus.getSchedule())

// const from = (await bus.fetchStop(Config.getBusConfig.fromStation, 'nl')).data;
// const to = (await bus.fetchStop(Config.getBusConfig.toStation[0], 'nl')).data;
// console.log(await bus.fetchConnections(from, to, DateFormatter.getDateTime(false), 3, 'nl'))
// const from = (await bus.fetchStop(Config.getBusConfig.fromStation)).data;
// const to = (await bus.fetchStop(Config.getBusConfig.toStation[0])).data;
// console.log(await bus.fetchConnections(from, to, new Date(), 3))
//console.log(await bus.fetchStop(Config.getBusConfig.fromStation))

console.log(await new TrainScheduleFetcher("Oostende", "Brugge").getSchedule());
