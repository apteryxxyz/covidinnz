/**
 * Gets a cookie value from a cookie string.
 * @param cookie Cookie string.
 * @param name Cookie key to get value for.
 * @returns Value if it exists.
 */
export function getCookie(cookie: string, name: string) {
    const nameEquals = `${name}=`;
    const cookieStrings = cookie.split(';');

    for (let cs of cookieStrings) {
        while (cs.startsWith(' ')) cs = cs.substring(1, cs.length);
        if (cs.startsWith(nameEquals)) return cs.substring(nameEquals.length, cs.length);
    }

    return null;
}

/**
 * Stringify a cookie.
 * @param name Cookie name.
 * @param value Cookie value.
 * @returns Cookie string.
 */
export function setCookie(name: string, value: string) {
    return `${name}=${value || ''}; path=/`;
}
