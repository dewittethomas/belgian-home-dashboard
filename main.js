import WasteCollectionFetcher from './models/fetchWasteCollection.js';
import TrainScheduleFetcher from './models/fetchTrainSchedule.js';
import DateFormatter from './utils/date_formatter.js';

/*const day = DateFormatter.getDateTime();
const end = DateFormatter.addDays(DateFormatter.getDateTime())
console.log(DateFormatter.calculateTimeBetween(day, end))*/
/*const thuis = new WasteCollectionFetcher("8000", "Hendrik Consciencelaan", "24");
console.log(await thuis.getCalendar())*/

/*const route = new TrainScheduleFetcher("Brugge", "Oostende");

console.log((await route.getSchedule(3)).data)*/

//console.log(await route.getSchedule())

import TramFetcher from './models/fetchBus.js';
const bus = new TramFetcher("Oostende Kapellestraat", "Stene Camelialaan")

console.log((await bus.getSchedule()).data)

//TODO: check for duration, filter on transit but also walking after the last transit

/*const weer = new WeatherFetcher("Los Angeles")
            .getWeather();

console.log(await weer)*/

//console.log(new Date(new Date()))