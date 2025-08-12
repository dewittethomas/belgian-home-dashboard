export default class TrainConnection {
    constructor(data) {
        this.departure = data.departure;
        this.arrival = data.arrival; 
        this.delay = data.delay; 
        this.platform = data.platform;
        this.transfers = data.transfers;
        this.canceled = data.canceled;
    }

    get isDelayed() {
        return this.delay > 0;
    }

    get durationMinutes() {
        const departureTime = this.departure.split(':').map(Number);
        const arrivalTime = this.arrival.split(':').map(Number);

        return (arrivalTime[0] * 60 + arrivalTime[1]) - (departureTime[0] * 60 + departureTime[1]);
    }
}