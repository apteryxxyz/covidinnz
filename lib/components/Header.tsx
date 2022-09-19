import Link from 'next/link';
import { Container } from '@components/Container';
import type { PageProps } from '@typings/PageProps';

export function Header(props: PageProps) {
    const totals = props?.vaccineData?.byEthnicity?.find(e => e.label === 'Total');
    const vaccinated = ((totals?.fiveToEleven?.completed || 0) + (totals?.twelvePlus?.completed || 0)) /
        ((totals?.fiveToEleven?.population || 0) + (totals?.twelvePlus?.population || 0)) * 100 || 'N/A';
    const icuCare = props?.currentCases?.summary?.icu || 'N/A';
    const newCases = props?.currentCases?.summary?.newCasesPerDay || 'N/A';

    return <Container
        elementName="header"
        parentClassName="bg-yellow-300 dark:!bg-slate-900 dark:!text-white"
        childClassName="container mx-auto p-5 flex flex-row"
    >
        <Link href="/" rel="noreferrer">
            <picture style={{ width: '15%' }} className="hidden md:block">
                <img
                    className="dark:invert"
                    src="/images/banner_black.png"
                    alt="COVID in NZ logo banner"
                />
            </picture>
        </Link>

        <div className="flex flex-row gap-5 m-auto md:mr-0 text-center">
            <div className="flex flex-col justify-center">
                <span className="text-3xl">{typeof vaccinated === 'number' ? vaccinated.toFixed(2) : vaccinated}%</span>
                <span>Vaccinated (5yo+)</span>
            </div>

            <div className="flex flex-col justify-center">
                <span className="text-3xl">{newCases}</span>
                <span>New Cases (avg)</span>
            </div>

            <div className="flex flex-col justify-center">
                <span className="text-3xl">{icuCare}</span>
                <span>In ICU</span>
            </div>
        </div>
    </Container>;
}
