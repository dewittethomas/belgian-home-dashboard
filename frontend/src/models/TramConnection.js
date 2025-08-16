export default class TramConnection {
    constructor(data) {
        this.departure = data.departure;
        this.arrival = data.arrival; 
        this.delay = data.delay; 
        this.transport = data.transport;
        this.transfers = data.transfers;
        this.walking = data.walking;
    }

    get isDelayed() {
        return this.delay > 0;
    }

    get isWalking() {
        return this.walking > 0;
    }
}