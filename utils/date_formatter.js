import moment from 'moment-timezone';
import fs from 'fs';

const weekdays = JSON.parse(fs.readFileSync('./assets/data/weekdays.json'));
const timezone = 'Europe/Brussels';

class DateFormatter {
    constructor(date=null) {
        this.date = DateFormatter.getDateTime(false, date)
    }

    getSeconds() {
        const seconds = String(this.date.getUTCSeconds()).padStart(2, '0');
        return seconds;
    }

    getMinutes() {
        const minutes = String(this.date.getUTCMinutes()).padStart(2, '0');
        return minutes;
    }

    getHours() {
        const hours = String(this.date.getUTCHours()).padStart(2, '0');
        return hours;
    }

    getDay() {
        const day = String(this.date.getUTCDate()).padStart(2, '0');
        const numericWeekDay = String(this.date.getUTCDay());

        const weekDay = weekdays[numericWeekDay];

        return {
            'day': day,
            'weekDay': weekDay
        };
    }

    getMonth() {
        const month = String(this.date.getUTCMonth() + 1).padStart(2, '0');
        return month;
    }

    getYear() {
        const year = String(this.date.getUTCFullYear());
        return year;
    }

    static addDays(date, days=7) {
        date.setDate(date.getDate() + days);
        return date;
    }

    static subtractMinutes(date, minutes) {
        date.setMinutes(date.getMinutes() - minutes);
        return date;
    }

    static convertSecondsToMinutes(seconds) {
        return Math.floor(seconds / 60);
    }

    static convertEpochToDateTime(epoch) {
        return new Date(epoch);
    }

    static convertDateTimeToString(date) {
        return new Date(date).toISOString();
    }

    static convertTimeToObject(time) {
        const minutes = DateFormatter.convertSecondsToMinutes(time);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes - (hours * 60);

        return {
            'hours': hours,
            'minutes': remainingMinutes
        };
    }

    static calculateTimeBetween(start, end) {
        const seconds = (end - start) / 1000;
        return seconds;
    }

    static format(dateTime, format='YYYY-MM-DD') {
        const date = new DateFormatter(dateTime);

        return format
            .replace('YYYY', date.getYear())
            .replace('YY', date.getYear().slice(-2))
            .replace("MM", date.getMonth())
            .replace("DD", date.getDay().day)
            .replace("HH", date.getHours())
            .replace("mm", date.getMinutes())
            .replace("ss", date.getSeconds());
    }

    static changeTimeZone(date, tz='Europe/Brussels') {
        const offset = (moment(date).tz(tz)).utcOffset();
        date.setTime(date.getTime() + offset * 60 * 1000);
        return date;
    }

    static getDateTime(tzAdapted=true, date=new Date()) {
        let dateTime;

        if (date instanceof Date) {
            dateTime = new Date(date);
        } else if (typeof date === 'number') {
            dateTime = DateFormatter.convertEpochToDateTime(date);
        } else {
            dateTime = new Date(date);
        }

        return tzAdapted ? this.changeTimeZone(dateTime, timezone) : dateTime;
    }
}

export default DateFormatter;