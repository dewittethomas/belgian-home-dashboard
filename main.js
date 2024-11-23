import WasteCollectionFetcher from './models/fetchWasteCollection.js';
import TrainScheduleFetcher from './models/fetchTrainSchedule.js';
import WeatherFetcher from './models/fetchWeather.js';
import FootballFetcher from './models/fetchFootball.js';

/*const day = DateFormatter.getDateTime();
const end = DateFormatter.addDays(DateFormatter.getDateTime())
console.log(DateFormatter.calculateTimeBetween(day, end))*/
/*const thuis = new WasteCollectionFetcher("8400", "Christinastraat", "18");
console.log(await thuis.getCalendar())*/

/*const route = new TrainScheduleFetcher("Oostende", "Gent-Sint-Pieters");

console.log((await route.getSchedule(3)).data)*/

//console.log(await route.getSchedule())

/*import BusFetcher from './models/fetchBusSchedule.js';
const bus = new BusFetcher("Oostende Kapellestraat", "Stene Camelialaan")

console.log((await bus.getSchedule()))*/

/*const weer = new WeatherFetcher("Sint-Genesius-Rode")
            .getWeather();

console.log(await weer)*/

const foot = new FootballFetcher("KVDO");
console.log((await foot.fetchTeam("Manchester")).data[0])