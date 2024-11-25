import WasteCollectionFetcher from './models/fetchWasteCollection.js';
import TrainScheduleFetcher from './models/fetchTrain.js';
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

/*import BusFetcher from './models/fetchBus.js';
const bus = new BusFetcher("Sint-Genesius-Rode Elvis Presley", "Alsemberg Winderickxplein")

console.log((await bus.getSchedule(2, 0)).data)*/

/*const weer = new WeatherFetcher("Sint-Genesius-Rode")
            .getWeather();

console.log(await weer)*/

const foot = new FootballFetcher("Club Brugge KV");
//console.log(foot.extractTeamData((await foot.fetchTeam('KVDO')).data))
console.log((await foot.getStatistics()).data)
//console.log(await foot.fetchLastMatches('802530'))
//console.log(await foot.extractMatchData((await foot.fetchLastMatch('802530')).data))
//console.log(await foot.extractMatchData((await foot.fetchLastMatch('802530')).data[0]));