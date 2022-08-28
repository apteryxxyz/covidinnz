/**
 * Convert a string to a number
 * @param value Value to convert
 * @returns A clean number
 */
export function cleanNumber(value: number | string) {
    // Numbers on the MoH website sometimes insides the characters in this regex
    return Number(value.toString().replace(/\*|,|%/g, ''));
}

/**
 * Add commas to a numbers string
 * @param value Number to add commas to
 * @returns A number with commas every 3 chars
 */
export function addCommas(value: number | string) {
    return cleanNumber(value).toLocaleString();
}

/**
 * Prepares an object for tables
 * @param object Object to prepare
 * @returns Object with stringify properties
 */
export function stringifyProperties(object: any): any {
    if (!object) return object;
    if (Array.isArray(object)) return object.map(stringifyProperties);

    const newObject: any = {};
    for (const p of Object.keys(object)) {
        if (typeof object[p] === 'object') newObject[p] = stringifyProperties(object[p]);
        else if (typeof object[p] === 'number') newObject[p] = addCommas(object[p]);
        else newObject[p] = object[p]?.toString();
    }
    return newObject;
}

export function toNZT(date: Date) {
    return date.toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' });
}
