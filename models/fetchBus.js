import DeLijnFetcher from "./fetchDeLijn.js";

const modes = [
    'bus'
]

class BusFetcher extends DeLijnFetcher {
    constructor(from, to) {
        super(from, to);
        this.modes = modes;
    }
}

export default BusFetcher;