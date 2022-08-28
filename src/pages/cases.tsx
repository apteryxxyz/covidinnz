import type { GetServerSideProps } from 'next';
import type { PropsWithChildren } from 'react';
import type { PageProps } from '@typings/PageProps';

import { getCurrentCase } from '@functions/currentCases';
import { getVaccineData } from '@functions/vaccineData';
import { getCaseDemographics } from '@functions/caseDemographics';
import { getLatestNewsItems } from '@functions/latestNewsItems';
import { getCookie } from '@utilities/cookieParse';
import { addCommas, stringifyProperties } from '@utilities/formatValue';

import { SectionGrid } from '@components/SectionGrid';
import { SectionItem } from '@components/SectionItem';
import { Table } from '@components/Table';
import { Chart } from '@components/Chart';

export default function Cases(props: PropsWithChildren<PageProps>) {
    return <SectionGrid>
        <SectionItem title="Summary">
            <Table
                type="left"
                headers={[
                    { name: 'Active', field: 'a', type: 'number' },
                    { name: 'Recovered', field: 'r', type: 'number' },
                    { name: 'Deceased', field: 'd', type: 'number' },
                ]}
                cells={[
                    {
                        a: addCommas(props.currentCases.outcomes.activeTotal),
                        r: addCommas(props.currentCases.outcomes.recoveredTotal),
                        d: addCommas(props.currentCases.outcomes.deceasedTotal),
                    },
                ]}
            />
        </SectionItem>

        <SectionItem title="By District">
            <Table
                type="top"
                defaultOrderBy="label"
                headers={[
                    { name: 'District', field: 'label', type: 'string', sortable: 1 },
                    { name: 'Active', field: 'active', type: 'number', sortable: 1 },
                    { name: 'Recovered', field: 'recovered', type: 'number', sortable: 1, },
                    { name: 'Deceased', field: 'deceased', type: 'number', sortable: 1, },
                    { name: 'Total', field: 'total', type: 'number', sortable: 1 },
                ]}
                cells={stringifyProperties(props.currentCases.locations)
                    .map((d: any) => ({
                        ...d,
                        active: d.last24Hours > 0 ? `${d.active} (+${d.last24Hours})` : d.active,
                    }))}
            />
        </SectionItem>

        <SectionItem title="By Ethnicity">
            <Table
                type="top"
                defaultOrderBy="label"
                headers={[
                    { name: 'Ethnicity', field: 'label', type: 'string' },
                    { name: 'Active', field: 'active', type: 'number', sortable: 1 },
                    { name: 'Recovered', field: 'recovered', type: 'number', sortable: 1, },
                    { name: 'Deceased', field: 'deceased', type: 'number', sortable: 1, },
                    { name: 'Total', field: 'total', type: 'number', sortable: 1 },
                ]}
                cells={stringifyProperties(props.caseDemographics.cases.byEthnicity)}
            />

            <Chart
                type="doughnut"
                data={props.caseDemographics.cases.byEthnicity //
                    .filter((d: any) => d.label !== 'Total')
                    .map((e) => ({
                        label: e.label,
                        value: e.total,
                    }))}
            />
        </SectionItem>

        <SectionItem title="By Age Group">
            <Table
                type="top"
                defaultOrderBy="label"
                headers={[
                    { name: 'Age Group', field: 'label', type: 'string' },
                    { name: 'Active', field: 'active', type: 'number', sortable: 1 },
                    { name: 'Recovered', field: 'recovered', type: 'number', sortable: 1, },
                    { name: 'Deceased', field: 'deceased', type: 'number', sortable: 1, },
                    { name: 'Total', field: 'total', type: 'number', sortable: 1 },
                ]}
                cells={stringifyProperties(props.caseDemographics.cases.byAgeGroup)}
            />

            <Chart
                type="doughnut"
                data={props.caseDemographics.cases.byAgeGroup //
                    .filter((d: any) => d.label !== 'Total')
                    .map((e) => ({
                        label: e.label,
                        value: e.total,
                    }))}
            />
        </SectionItem>

        <SectionItem title="By Gender">
            <Table
                type="top"
                defaultOrderBy="label"
                headers={[
                    { name: 'Gender', field: 'label', type: 'string' },
                    { name: 'Active', field: 'active', type: 'number', sortable: 1 },
                    { name: 'Recovered', field: 'recovered', type: 'number', sortable: 1, },
                    { name: 'Deceased', field: 'deceased', type: 'number', sortable: 1, },
                    { name: 'Total', field: 'total', type: 'number', sortable: 1 },
                ]}
                cells={stringifyProperties(props.caseDemographics.cases.byGender)}
            />

            <Chart
                type="doughnut"
                data={props.caseDemographics.cases.byGender //
                    .filter((d: any) => d.label !== 'Total')
                    .map((e) => ({
                        label: e.label,
                        value: e.total,
                    }))}
            />
        </SectionItem>
    </SectionGrid>;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const theme = req.headers.cookie ? getCookie(req.headers.cookie, 'theme') || 'light' : 'light';
    const currentCases = await getCurrentCase();
    const caseDemographics = await getCaseDemographics();
    const vaccineData = await getVaccineData();
    const latestNewsItems = await getLatestNewsItems();
    return { props: { theme, currentCases, caseDemographics, vaccineData, latestNewsItems } };
};
