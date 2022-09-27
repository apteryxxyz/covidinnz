/**
 * @file Handles scrapping of the MoH "Current cases" page
 */

import { getJson, saveJson } from '@utilities/cacheHelpers';
import { resolve } from 'node:path';
import { Tabletojson } from 'tabletojson';
import * as cheerio from 'cheerio';

const SourceUrl =
    'https://www.health.govt.nz/covid-19-novel-coronavirus/' +
    'covid-19-data-and-statistics/covid-19-current-cases';
const DateRegex = /Last updated (\d)(am|pm) (\d{1,2}) ([a-z]{3,9}) (\d{4})/i;
const CachePath = resolve('public/cache/currentCases.json');

export interface CurrentCases {
    updatedAt: number;
    checkedAt: number;
    summary: ReturnType<typeof makeSummary>;
    current: ReturnType<typeof makeCurrent>;
    outcomes: ReturnType<typeof makeOutcomes>;
    deaths: ReturnType<typeof makeDeaths>;
    details: ReturnType<typeof makeDetails>;
    locations: ReturnType<typeof makeLocations>;
}

export async function getCurrentCase() {
    const parsedJson = await getJson<CurrentCases>(CachePath);
    const checked = new Date(parsedJson.checkedAt || 0);
    if (checked.getTime() > Date.now() - 600000) return parsedJson;

    const html = await fetch(SourceUrl).then((r) => r.text());
    const tables = Tabletojson.convert(html, { forceIndexAsNumber: true });
    const [, rawTime, frame, day, month, year] = html.match(DateRegex) as string[];
    const time = parseInt(rawTime, 10) + (frame === 'pm' ? 12 : 0);
    const updatedAt = new Date(`${time}:00 ${day} ${month} ${year} (NZT)`).getTime();
    const checkedAt = new Date().getTime();

    const summary = makeSummary(html);
    const current = makeCurrent(tables[0].map(Object.values).flat());
    const outcomes = makeOutcomes(tables[1].map(Object.values));
    const deaths = makeDeaths(tables[2].map(Object.values));
    const details = makeDetails(tables[3].map(Object.values).flat());
    const locations = makeLocations(tables[5].map(Object.values));

    const json = { updatedAt, checkedAt, summary, current, outcomes, deaths, details, locations };
    return saveJson<CurrentCases>(CachePath, json);
}

const clean = (s?: string) => s ? Number(s?.replace(/\*|,|%/g, '')) ?? 0 : 0;

const CasesRegex = /New case average\*? ([0-9,]+)/i;
const RATRegex = /RATs uploaded average\*? ([0-9,]+)/i;
const HospitalRegex = /Cases in ICU as at midnight (?:[a-z]+) ([0-9,]+)/i;
const IcuRegex = /Cases in ICU as at midnight (?:[a-z]+) ([0-9,]+)/i;
const DeathsRegex = /Deaths attributed to COVID\*? ([0-9,]+)/i;
const TotalDeathsRegex = /Total deaths attributed COVID ([0-9,]+)/i;

function makeSummary(html: string) {
    const $ = cheerio.load(html);
    const content = $('.col-sm-6').text()
        .replaceAll('\n', ' ').replace(/ +/g, ' ').replaceAll(' ', ' ');

    return {
        newCasesPerDay: clean(content.match(CasesRegex)?.[1]),
        ratPerDay: clean(content.match(RATRegex)?.[1]),
        icu: clean(content.match(IcuRegex)?.[1]),
        hospitalisations: clean(content.match(HospitalRegex)?.[1]),
        deathsPerDay: clean(content.match(DeathsRegex)?.[1]),
        deathsPerWeek: clean(content.match(TotalDeathsRegex)?.[1]),

    }
}

function makeCurrent(values: string[]) {
    return {
        newCases: clean(values[0]),
        newReinfections: clean(values[1]),
        allTimeCases: clean(values[3]),
        totalReinfections: clean(values[4]),
    };
}

function makeOutcomes(values: string[][]) {
    return {
        recoveredChange: clean(values[0][0]),
        recoveredTotal: clean(values[0][1]),
        deceasedChange: clean(values[1][0]),
        deceasedTotal: clean(values[1][1]),
    };
}

function makeDeaths(values: string[][]) {
    return [
        'COVID as underlying',
        'COVID as contributory',
        'COVID-attributed total',
        'Not COVID',
        'Not available',
        'Total',
    ].map((e, i) => ({
        label: e,
        within28Days: clean(values[i][0]),
        moreThan28Days: clean(values[i][1]),
        total: clean(values[i][2]),
        last24Hours: clean(values[i][3]),
    }));
}

function makeDetails(values: string[]) {
    return {
        confirmedChange: clean(values[0]),
        confirmedTotal: clean(values[1]),
        probableChange: clean(values[2]),
        probableTotal: clean(values[3]),
        totalChange: clean(values[4]),
        total: clean(values[5]),
    }
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
