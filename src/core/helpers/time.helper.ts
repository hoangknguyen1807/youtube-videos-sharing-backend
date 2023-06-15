import moment from 'moment';

export function isExpire(timestamp: number | Date) {
    return moment().isBefore(moment(timestamp));
}

export function isTimestamp(timestamp: number) {
    return moment.unix(timestamp).isValid();
}

export function convertTimestampToIsoString(timestamp: number) {
    return moment.unix(timestamp).format();
}

export function durationSecondsTime(publishedAt: Date, timeWindow: number) {
    if (!publishedAt) {
        return timeWindow * 60 * 60;
    }

    const now = moment.utc();
    const end = moment(publishedAt).utc();
    const seconds = now.diff(end, 'seconds');
    const duration = timeWindow * 60 * 60 - seconds;

    return duration > 0 ? duration : 0;
}
