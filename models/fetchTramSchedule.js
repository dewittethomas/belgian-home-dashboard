import DeLijnFetcher from "./fetchDeLijn.js";

const modes = [
    'lightRail'
]

class TramFetcher extends DeLijnFetcher {
    constructor(from, to) {
        super(from, to);
        this.modes = modes;
    }
}

export default TramFetcher;