import SportFetcher from "./fetchSport.js";

const sports = ['football'];

class FootballFetcher extends SportFetcher {
    constructor(team) {
        super(team);
        this.sports = sports;
    }
}

export default FootballFetcher;