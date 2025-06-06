import SportFetcher from "./fetchSport.js";

const sports = ['basketball'];

class BasketballFetcher extends SportFetcher {
    constructor(team) {
        super(team);
        this.sports = sports;
    }
}

export default BasketballFetcher;