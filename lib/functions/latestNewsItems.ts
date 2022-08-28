/**
 * @file Handles scrapping of the MoH "Latest news items" page
 */

const SourceUrl = 'https://www.health.govt.nz/news-media/news-items';
const ContentRegex = /([0-9,]+) community cases; ([0-9,]+) hospitalisations; ([0-9,]+) in ICU/i;
const DateRegex = /(\d{1,2}) ([a-z]{3,9}) (\d{4})/i;

export async function getLatestNewsItems() {
    const html = await fetch(SourceUrl).then((r) => r.text());
    const [, cases, hospitalisations, icu] = html.match(ContentRegex) as string[];
    const [, date, month, year] = html.match(DateRegex) as string[];
    const updatedTimestamp = new Date(`1pm ${date} ${month} ${year} (NZT)`).getTime();
    return { updatedTimestamp, cases, hospitalisations, icu };
}
