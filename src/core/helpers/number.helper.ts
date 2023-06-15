export function parseToInt(value: string) {
    return parseInt(value) || 0;
}

export function parseToFloat(value: string) {
    return parseFloat(value) || 0;
}

export function roundNumber(number, scale) {
    return Math.round(number * Math.pow(10, scale)) / Math.pow(10, scale);
}
