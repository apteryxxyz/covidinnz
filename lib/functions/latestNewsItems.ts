/**
 * @file Handles scrapping of the MoH "Latest news items" page
 */
import { getJson, saveJson } from '@utilities/cacheHelpers';
import { resolve } from 'node:path';

const SourceUrl = 'https://www.health.govt.nz/news-media/news-items';
const ContentRegex = /([0-9,]+) community cases; ([0-9,]+) hospitalisations; ([0-9,]+) in ICU/i;
const DateRegex = /(\d{1,2}) ([a-z]{3,9}) (\d{4})/i;
const CachePath = resolve('public/cache/latestNewsItems.json');

export interface LatestNewsItems {
    updatedAt: number;
    checkedAt: number;
    cases: string;
    hospitalisations: string;
    icu: string;
}

export async function getLatestNewsItems() {
    const parsedJson = await getJson<LatestNewsItems>(CachePath);
    const checked = new Date(parsedJson.checkedAt || 0);
    if (checked.getTime() > Date.now() - 600000) return parsedJson;

    const html = await fetch(SourceUrl).then((r) => r.text());
    const [, cases, hospitalisations, icu] = html.match(ContentRegex) as string[];
    const [, date, month, year] = html.match(DateRegex) as string[];
    const updatedAt = new Date(`1pm ${date} ${month} ${year} (NZT)`).getTime();
    const checkedAt = new Date().getTime();

    return saveJson(CachePath, { updatedAt, checkedAt, cases, hospitalisations, icu });
}
