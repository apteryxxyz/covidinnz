import type { CaseDemographics } from '@functions/caseDemographics';
import type { CurrentCases } from '@functions/currentCases';
import type { LatestNewsItems } from '@functions/latestNewsItems';
import type { VaccineData } from '@functions/vaccineData';

export interface PageProps {
    theme: 'dark' | 'light';
    currentCases: CurrentCases;
    caseDemographics: CaseDemographics;
    vaccineData: VaccineData;
    latestNewsItems: LatestNewsItems;
}
