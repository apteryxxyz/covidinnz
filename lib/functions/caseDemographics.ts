/**
 * @file Handles scrapping of the MoH "Case demographics" page
 */

import { getJson, saveJson } from '@utilities/cacheHelpers';
import { resolve } from 'node:path';
import { Tabletojson } from 'tabletojson';

const SourceUrl =
    'https://www.health.govt.nz/covid-19-novel-coronavirus' +
    '/covid-19-data-and-statistics/covid-19-case-demographics';
const DateRegex = /Last updated (\d)(am|pm) (\d{1,2}) ([a-z]{3,9}) (\d{4})/i;
const CachePath = resolve('public/cache/caseDemographics.json');

export interface CaseDemographics {
    updatedAt: number;
    checkedAt: number;
    cases: {
        byEthnicity: ReturnType<typeof makeCasesByEthnicity>;
        byAgeGroup: ReturnType<typeof makeCasesByAgeGroup>;
        byGender: ReturnType<typeof makeCasesByGender>;
    };
    hospital: {
        byGender: ReturnType<typeof makeHospitalByGender>;
        byAgeGroup: ReturnType<typeof makeHospitalByAgeGroup>;
        byEthnicity: ReturnType<typeof makeHospitalByEthnicity>;
    };
}

export async function getCaseDemographics() {
    const parsedJson = await getJson<CaseDemographics>(CachePath);
    const checked = new Date(parsedJson.checkedAt || 0);
    if (checked.getTime() > Date.now() - 600000) return parsedJson;

    const html = await fetch(SourceUrl).then((r) => r.text());
    const tables = Tabletojson.convert(html, { forceIndexAsNumber: true });
    const [, rawTime, frame, day, month, year] = html.match(DateRegex) as string[];
    const time = parseInt(rawTime, 10) + (frame === 'pm' ? 12 : 0);
    const updatedAt = new Date(`${time}:00 ${day} ${month} ${year} (NZT)`).getTime();
    const checkedAt = new Date().getTime();

    const cases = {
        byEthnicity: makeCasesByEthnicity(tables[5].map(Object.values)),
        byAgeGroup: makeCasesByAgeGroup(tables[6].map(Object.values)),
        byGender: makeCasesByGender(tables[7].map(Object.values)),
    };

    const hospital = {
        byGender: makeHospitalByGender(tables[0].map(Object.values)),
        byAgeGroup: makeHospitalByAgeGroup(tables[1].map(Object.values)),
        byEthnicity: makeHospitalByEthnicity(tables[2].map(Object.values)),
    };

    const json = { updatedAt, checkedAt, cases, hospital };
    return saveJson<CaseDemographics>(CachePath, json);
}

const clean = (s: string) => Number(s?.replace(/\*|,|%/g, '')) ?? null;

function makeCasesByEthnicity(values: string[][]) {
    return [
        'Māori',
        'Pacific Peoples',
        'Asian',
        'Middle Eastern, Latin American and African (MELAA)',
        'European or Other',
        'Unknown',
        'Total',
    ].map((e, i) => ({
        label: e,
        active: clean(values[i][0]),
        recovered: clean(values[i][1]),
        deceased: clean(values[i][2]),
        total: clean(values[i][3]),
        precentage: clean(values[i][4]),
    }));
}

function makeCasesByAgeGroup(values: string[][]) {
    return [
        '0 to 9',
        '10 to 19',
        '20 to 29',
        '30 to 39',
        '40 to 49',
        '50 to 59',
        '60 to 69',
        '70 to 79',
        '80 to 89',
        '90+',
        'Unknown',
        'Total',
    ].map((e, i) => ({
        label: e,
        active: clean(values[i][0]),
        recovered: clean(values[i][1]),
        deceased: clean(values[i][2]),
        total: clean(values[i][3]),
        precentage: clean(values[i][4]),
    }));
}

function makeCasesByGender(values: string[][]) {
    return ['Female', 'Male', 'Unknown', 'Total'].map((e, i) => ({
        label: e,
        active: clean(values[i][0]),
        recovered: clean(values[i][1]),
        deceased: clean(values[i][2]),
        total: clean(values[i][3]),
        precentage: clean(values[i][4]),
    }));
}

function makeHospitalByGender(values: string[][]) {
    return ['Female', 'Male', 'Unknown', 'Total'].map((e, i) => ({
        label: e,
        cases: values[i][0],
        hospitalisations: values[i][1],
        icu: values[i][2],
    }));
}

function makeHospitalByAgeGroup(values: string[][]) {
    return [
        '0 to 9',
        '10 to 19',
        '20 to 29',
        '30 to 39',
        '40 to 49',
        '50 to 59',
        '60 to 69',
        '70+',
        'Unknown',
        'Total',
    ].map((e, i) => ({
        label: e,
        cases: values[i][0],
        hospitalisations: values[i][1],
        icu: values[i][2],
    }));
}

function makeHospitalByEthnicity(values: string[][]) {
    return [
        'Māori',
        'Pacific Peoples',
        'Asian',
        'Middle Eastern, Latin American and African (MELAA)',
        'European or Other',
        'Unknown',
        'Total',
    ].map((e, i) => ({
        label: e,
        cases: values[i][0],
        hospitalisations: values[i][1],
        icu: values[i][2],
    }));
}
