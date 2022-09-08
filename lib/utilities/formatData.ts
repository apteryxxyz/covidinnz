import type { PageProps } from "@typings/PageProps";
import { addCommas, toNZT } from "./formatValue";

export function formatSummary(current: PageProps['currentCases']) {
    const at = toNZT(new Date(current.updatedAt));
    let text = `As of ${at}, the Ministry of Health New Zealand reported in the last 24 hours;`;

    const activeChange = current.summary.newCases;
    const activeTotal = current.summary.activeCases;
    const { recoveredChange, recoveredTotal } = current.outcomes;
    const { deceasedChange, deceasedTotal } = current.outcomes;

    if (activeChange > 1) text += `\n - ${addCommas(activeChange)} new cases of COVID-19`;
    else if (activeChange === 1) text += `\n - 1 new case of COVID-19`;
    else text += `\n - No new cases of COVID-19`;

    if (activeTotal > 1) text += `, there is currently ${addCommas(activeTotal)} active cases in New Zealand.`;
    else if (activeTotal === 1) text += `, there is currently 1 active case in New Zealand.`;
    else text += `, there are currently no active cases in New Zealand.`;

    if (recoveredChange > 1) text += `\n - ${addCommas(recoveredChange)} people have recovered from the virus`;
    else if (recoveredChange === 1) text += '\n - 1 person has recovered from the virus';
    else if (deceasedChange === 0) text += '\n - No new recovereries from the virus';

    if (recoveredChange > 0) text += `, for a new total of ${addCommas(recoveredTotal)}.`;
    else text += `, the current total is ${addCommas(deceasedTotal)}.`;

    if (deceasedChange > 1) text += `\n - ${addCommas(deceasedChange)} people have died from the virus`;
    else if (deceasedChange === 1) text += '\n - 1 person has died from the virus';
    else if (deceasedChange === 0) text += '\n - No new deaths from the virus';

    if (deceasedChange > 0) text += `, for a new total of ${addCommas(deceasedTotal)}.`;
    else text += `, the current total is ${addCommas(deceasedTotal)}.`;

    return text;
}

export function formatVaccinations(vaccine: PageProps["vaccineData"]) {
    const totals = vaccine.byEthnicity.find(e => e.label === 'Total') as any;

    const partially = totals.fiveToEleven.partially + totals.twelvePlus.partially;
    const completed = totals.fiveToEleven.completed + totals.twelvePlus.completed;
    const population = totals.fiveToEleven.population + totals.twelvePlus.population;
    const unvaccinated = population - completed - (partially - completed);

    const partiallyPercentage = partially / population * 100;
    const completedPercentage = completed / population * 100;
    const unvaccinatedPercentage = 100 - completedPercentage - (partiallyPercentage - completedPercentage);

    return {
        partially, partiallyPercentage,
        completed, completedPercentage,
        unvaccinated, unvaccinatedPercentage,
        population,
    }
}

export function formatHospital(hospital: PageProps["caseDemographics"]["hospital"], news: PageProps["latestNewsItems"]) {
    const totals = hospital.byEthnicity.find(e => e.label === 'Total');
    if (!totals) throw 'This should never be reached, just here for typings';
    return {
        inIcu: news.icu,
        inHospital: news.hospitalisations,
        allTimeIcu: totals.icu,
        allTimeHospital: totals.hospitalisations,
    }
}
