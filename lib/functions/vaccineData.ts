/**
 * @file Handles scrapping of the MoH "Vaccine data" page
 */

import { Tabletojson } from 'tabletojson';

const SourceUrl =
    'https://www.health.govt.nz/covid-19-novel-coronavirus/' +
    'covid-19-data-and-statistics/covid-19-vaccine-data';
const DateRegex = /is as at (\d\d?):(\d\d)(am|pm) (\d{1,2}) ([a-z]{3,9}) (\d{4})/i;

export async function getVaccineData() {
    const html = await fetch(SourceUrl).then((r) => r.text());
    const tables = Tabletojson.convert(html, { forceIndexAsNumber: true });
    const [, rawHour, minute, frame, day, month, year] = html.match(DateRegex) as string[];
    const hour = parseInt(rawHour, 10) + (frame === 'pm' ? 12 : 0);
    const updatedTimestamp = new Date(`${hour}:${minute} ${day} ${month} ${year} (NZT)`).getTime();

    const byEthnicity = makeByEthnicity(tables[1].map(Object.values));
    const byDistrict = makeByDistrict(tables[6].map(Object.values), tables[9].map(Object.values));

    return { updatedTimestamp, byEthnicity, byDistrict };
}

const clean = (s: string) => Number(s?.replace(/\*|,|%/g, '')) ?? null;

function makeByEthnicity(values: string[][]) {
    return [
        'Māori', 'Pacific Peoples', 'Asian',
        'European / Other', 'Unknown', 'Total'
    ].map((e, i) => ({
        label: e,
        twelvePlus: {
            partially: clean(values[i][0]),
            completed: clean(values[i][1]),
            population: clean(values[i][2]),
        },
        fiveToEleven: {
            partially: clean(values[i][3]),
            completed: clean(values[i][4]),
            population: clean(values[i][5]),
        },
    }));
}

function makeByDistrict(tp: string[][], fe: string[][]) {
    return [
        'Northland', 'Waitemata', 'Auckland', 'Counties Manukau',
        'Waikato', 'Lakes', 'Bay of Plenty', 'Tairāwhiti', 'Taranaki',
        'Hawkes Bay', 'MidCentral', 'Whanganui', 'Capital and Coast',
        'Hutt Valley', 'Wairarapa', 'Nelson Marlborough', 'West Coast',
        'Canterbury', 'South Canterbury', 'Southern', 'Unknown',
        'Total'
    ].map((e, i) => ({
        label: e,
        twelvePlus: {
            partially: clean(tp[i][0]),
            partiallyPrecentage: clean(tp[i][1]),
            completed: clean(tp[i][2]),
            completedPrecentage: clean(tp[i][3]),
            population: clean(tp[i][4]),
        },
        fiveToEleven: {
            partially: clean(fe[i][0]),
            partiallyPrecentage: clean(fe[i][1]),
            completed: clean(fe[i][2]),
            completedPrecentage: clean(fe[i][3]),
            population: clean(fe[i][4]),
        }
    }))
}
