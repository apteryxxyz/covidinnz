import type { getCaseDemographics } from '@functions/caseDemographics';
import type { getCurrentCase } from '@functions/currentCases';
import type { getLatestNewsItems } from '@functions/latestNewsItems';
import type { getVaccineData } from '@functions/vaccineData';

export interface PageProps {
    theme: 'dark' | 'light';
    currentCases: Awaited<ReturnType<typeof getCurrentCase>>;
    caseDemographics: Awaited<ReturnType<typeof getCaseDemographics>>;
    vaccineData: Awaited<ReturnType<typeof getVaccineData>>;
    latestNewsItems: Awaited<ReturnType<typeof getLatestNewsItems>>;
}
