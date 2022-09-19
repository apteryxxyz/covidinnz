import type { GetServerSideProps } from 'next';
import type { PropsWithChildren } from 'react';
import type { PageProps } from '@typings/PageProps';

// import { getCurrentCase } from '@functions/currentCases';
// import { getVaccineData } from '@functions/vaccineData';
// import { getCaseDemographics } from '@functions/caseDemographics';
// import { getLatestNewsItems } from '@functions/latestNewsItems';
import { getCookie } from '@utilities/cookieParse';
import { addCommas, stringifyProperties } from '@utilities/formatValue';

import { SectionGrid } from '@components/SectionGrid';
import { SectionItem } from '@components/SectionItem';
import { Table } from '@components/Table';
import { formatHospital, formatSummary, formatVaccinations } from '@utilities/formatData';

export default function Home(props: PropsWithChildren<PageProps>) {
    const summary = formatSummary(props.currentCases);
    const vaccinated = formatVaccinations(props.vaccineData);
    const hospital = formatHospital(props.caseDemographics.hospital, props.latestNewsItems);

    return <SectionGrid>
        <SectionItem title="Summary">
            {summary}
        </SectionItem>

        <SectionItem title="Cases" url="/cases">
            <Table
                type="left"
                headers={[
                    { field: 'c', name: 'New Cases', type: 'number' },
                    { field: 'r', name: 'New Reinfections', type: 'number' },
                    { field: 'a', name: 'Currently Active', type: 'number' },
                    { field: 't', name: 'All Time Total', type: 'number' },
                ]}
                cells={[
                    stringifyProperties({
                        c: props.currentCases.summary.newCases,
                        r: props.currentCases.summary.newReinfections,
                        a: props.currentCases.summary.activeCases,
                        t: props.currentCases.summary.allTimeCases,
                    }),
                ]}
            />
        </SectionItem>

        <SectionItem title="Vaccinations" url="/vaccinations">
            <Table
                type="left"
                headers={[
                    { field: 'a', name: 'Population', type: 'number' },
                    { field: 'c', name: 'Completed Primary Course', type: 'number' },
                    { field: 'p', name: 'Partially Vaccinated', type: 'number' },
                    { field: 'u', name: 'Unvaccinated', type: 'number' },
                ]}
                cells={[{
                    a: `${addCommas(vaccinated.population)}`,
                    c: `${addCommas(vaccinated.completed)} (${vaccinated.completedPercentage.toFixed(2)}%)`,
                    p: `${addCommas(vaccinated.partially)} (${vaccinated.partiallyPercentage.toFixed(2)}%)`,
                    u: `${addCommas(vaccinated.unvaccinated)} (${vaccinated.unvaccinatedPercentage.toFixed(2)}%)`,
                }]}
            />
        </SectionItem>

        <SectionItem title="Hospitalisations">
            <Table
                type="left"
                headers={[
                    { field: 'ih', name: 'In Hospital', type: 'number' },
                    { field: 'ii', name: 'In ICU', type: 'number' },
                    { field: 'ah', name: 'All Time Hospital', type: 'number' },
                    { field: 'ai', name: 'All Time ICU', type: 'number' },
                ]}
                cells={[{
                    ih: addCommas(hospital.inHospital),
                    ii: addCommas(hospital.inIcu),
                    ah: addCommas(hospital.allTimeHospital),
                    ai: addCommas(hospital.allTimeIcu),
                }]}
            />
        </SectionItem>
    </SectionGrid>;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const theme = req.headers.cookie ? getCookie(req.headers.cookie, 'theme') || 'light' : 'light';
    return { props: { theme } };
    // const currentCases = await getCurrentCase();
    // const caseDemographics = await getCaseDemographics();
    // const vaccineData = await getVaccineData();
    // const latestNewsItems = await getLatestNewsItems();
    // return { props: { theme, currentCases, caseDemographics, vaccineData, latestNewsItems } };
};
