/**
 * @file Handles scrapping of the MoH "Current cases" page
 */

import { Tabletojson } from 'tabletojson';

const SourceUrl =
    'https://www.health.govt.nz/covid-19-novel-coronavirus/' +
    'covid-19-data-and-statistics/covid-19-current-cases';
const DateRegex = /Last updated (\d)(am|pm) (\d{1,2}) ([a-z]{3,9}) (\d{4})/i;

export async function getCurrentCase() {
    const html = await fetch(SourceUrl).then((r) => r.text());
    const tables = Tabletojson.convert(html, { forceIndexAsNumber: true });
    const [, rawTime, frame, day, month, year] = html.match(DateRegex) as string[];
    const time = parseInt(rawTime, 10) + (frame === 'pm' ? 12 : 0);
    const updatedTimestamp = new Date(`${time}:00 ${day} ${month} ${year} (NZT)`).getTime();

    const summary = makeSummary(tables[0].map(Object.values).flat());
    const outcomes = makeOutcomes(tables[1].map(Object.values));
    const deaths = makeDeaths(tables[2].map(Object.values));
    const locations = makeLocations(tables[5].map(Object.values));

    return { updatedTimestamp, summary, outcomes, deaths, locations };
}

const clean = (s: string) => Number(s?.replace(/\*|,|%/g, '')) ?? null;

function makeSummary(values: string[]) {
    return {
        newCases: clean(values[0]),
        newReinfections: clean(values[1]),
        allTimeCases: clean(values[3]),
        totalReinfections: clean(values[4]),
        atTheBorder: clean(values[6]),
        inTheCommunity: clean(values[7]),
        activeCases: clean(values[8]),
    };
}

function makeOutcomes(values: string[][]) {
    return {
        activeChange: clean(values[0][0]),
        activeTotal: clean(values[0][1]),
        recoveredChange: clean(values[1][0]),
        recoveredTotal: clean(values[1][1]),
        deceasedChange: clean(values[2][0]),
        deceasedTotal: clean(values[2][1]),
    };
}

function makeDeaths(values: string[][]) {
    return [
        'COVID as underlying',
        'COVID as contributory',
        'COVID-attributed total',
        'Not COVID',
        'Not available',
    ].map((e, i) => ({
        label: e,
        within28Days: clean(values[i][0]),
        moreThan28Days: clean(values[i][1]),
        total: clean(values[i][2]),
        last24Hours: clean(values[i][3]),
    }));
}

function makeLocations(values: string[][]) {
    return values.map((items) => ({
        label: items[0],
        active: clean(items[1]),
        recovered: clean(items[2]),
        deceased: clean(items[3]),
        total: clean(items[4]),
        last24Hours: clean(items[5]),
    }));
}
