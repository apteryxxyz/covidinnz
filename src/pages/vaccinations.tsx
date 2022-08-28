import type { GetServerSideProps } from 'next';
import type { PropsWithChildren } from 'react';
import type { PageProps } from '@typings/PageProps';

import { getCurrentCase } from '@functions/currentCases';
import { getVaccineData } from '@functions/vaccineData';
import { getCaseDemographics } from '@functions/caseDemographics';
import { getLatestNewsItems } from '@functions/latestNewsItems';
import { getCookie } from '@utilities/cookieParse';
import { stringifyProperties } from '@utilities/formatValue';

import { SectionGrid } from '@components/SectionGrid';
import { SectionItem } from '@components/SectionItem';
import { Table } from '@components/Table';
import { Chart } from '@components/Chart';

export default function Vaccinations(props: PropsWithChildren<PageProps>) {
    const totals = props.vaccineData.byEthnicity.find(e => e.label === 'Total');
    if (!totals) throw 'This should never be reached, just here for typings';

    const tpPopulation = totals.twelvePlus.population;
    const tpComplete = totals.twelvePlus.completed;
    const tpPartial = totals.twelvePlus.partially - tpComplete;
    const tpUnvaccinated = tpPopulation - tpComplete - tpPartial;

    const fePopulation = totals.fiveToEleven.population;
    const feComplete = totals.fiveToEleven.completed;
    const fePartial = totals.fiveToEleven.partially - feComplete;
    const feUnvaccinated = fePopulation - feComplete - fePartial;

    return <SectionGrid>
        <SectionItem title="Summary - 12 and up">
            <Chart
                type="doughnut"
                data={[
                    { label: 'Completed Course', value: tpComplete },
                    { label: 'Partially', value: tpPartial },
                    { label: 'Unvaccinated', value: tpUnvaccinated },
                ]}
            />
        </SectionItem>

        <SectionItem title="By District - 12 and up">
            <Table
                type="top"
                defaultOrderBy="label"
                headers={[
                    { name: 'District', field: 'label', type: 'string', sortable: 1 },
                    { name: 'Partially', field: 'partially', type: 'string', sortable: 1 },
                    { name: 'Completed Course', field: 'completed', type: 'string', sortable: 1 },
                    { name: 'Population', field: 'population', type: 'string', sortable: 1 },
                ]}
                cells={props.vaccineData.byDistrict
                    .map(stringifyProperties)
                    .map(d => ({
                        label: d.label,
                        ...d.twelvePlus,
                        partially: `${d.twelvePlus.partially} (${d.twelvePlus.partiallyPrecentage}%)`,
                        completed: `${d.twelvePlus.completed} (${d.twelvePlus.completedPrecentage}%)`
                    }))}
            />
        </SectionItem>

        <SectionItem title="By Ethnicity - 12 and up">
            <Table
                type="top"
                defaultOrderBy="label"
                headers={[
                    { name: 'District', field: 'label', type: 'string', sortable: 1 },
                    { name: 'Partially', field: 'partially', type: 'string', sortable: 1 },
                    { name: 'Completed Course', field: 'completed', type: 'string', sortable: 1 },
                    { name: 'Population', field: 'population', type: 'string', sortable: 1 },
                ]}
                cells={props.vaccineData.byEthnicity
                    .map(stringifyProperties)
                    .map(d => ({
                        label: d.label,
                        ...d.twelvePlus
                    }))}
            />
        </SectionItem>

        <SectionItem title="Summary - 5 to 11">
            <Chart
                type="doughnut"
                data={[
                    { label: 'Completed Course', value: feComplete },
                    { label: 'Partially', value: fePartial },
                    { label: 'Unvaccinated', value: feUnvaccinated },
                ]}
            />
        </SectionItem>

        <SectionItem title="By District - 5 to 11">
            <Table
                type="top"
                defaultOrderBy="label"
                headers={[
                    { name: 'District', field: 'label', type: 'string', sortable: 1 },
                    { name: 'Partially', field: 'partially', type: 'string', sortable: 1 },
                    { name: 'Completed Course', field: 'completed', type: 'string', sortable: 1 },
                    { name: 'Population', field: 'population', type: 'string', sortable: 1 },
                ]}
                cells={props.vaccineData.byDistrict
                    .map(stringifyProperties)
                    .map(d => ({
                        label: d.label,
                        ...d.fiveToEleven,
                        partially: `${d.fiveToEleven.partially} (${d.fiveToEleven.partiallyPrecentage}%)`,
                        completed: `${d.fiveToEleven.completed} (${d.fiveToEleven.completedPrecentage}%)`
                    }))}
            />
        </SectionItem>

        <SectionItem title="By Ethnicity - 5 to 11">
            <Table
                type="top"
                defaultOrderBy="label"
                headers={[
                    { name: 'District', field: 'label', type: 'string', sortable: 1 },
                    { name: 'Partially', field: 'partially', type: 'string', sortable: 1 },
                    { name: 'Completed Course', field: 'completed', type: 'string', sortable: 1 },
                    { name: 'Population', field: 'population', type: 'string', sortable: 1 },
                ]}
                cells={props.vaccineData.byEthnicity
                    .map(stringifyProperties)
                    .map(d => ({
                        label: d.label,
                        ...d.fiveToEleven
                    }))}
            />
        </SectionItem>
    </SectionGrid>
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const theme = req.headers.cookie ? getCookie(req.headers.cookie, 'theme') || 'light' : 'light';
    const currentCases = await getCurrentCase();
    const caseDemographics = await getCaseDemographics();
    const vaccineData = await getVaccineData();
    const latestNewsItems = await getLatestNewsItems();
    return { props: { theme, currentCases, caseDemographics, vaccineData, latestNewsItems } };
};
