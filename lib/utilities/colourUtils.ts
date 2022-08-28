/**
 * A list of colours, used for colour the charts.
 * @returns List of hexes.
 */
export function defaultColours() {
    return [
        '#e6194B', // red
        '#f58231', // orange
        '#ffe119', // yellow
        '#bfef45', // lime
        '#3cb44b', // green
        '#42d4f4', // cyan
        '#4363d8', // blue
        '#000075', // navy
        '#911eb4', // purple
        '#f032e6', // magenta
        '#a9a9a9', // grey
        '#000000', // black
    ];
}

/**
 * Add transparency to a colour.
 * @param hex Hex code.
 * @param alpha Alpha number.
 * @returns RGBA.
 */
export function addAlpha(hex: string, alpha = 0.22) {
    const values = hex.match(/\w\w/g) as Array<string>;
    const rgb = values.map((x) => parseInt(x, 16));
    return `rgba(${rgb},${alpha})`;
}
