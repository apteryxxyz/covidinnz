import Link from 'next/link';
import { Container } from '@components/Container';
import { getCookie, setCookie } from '@utilities/cookieParse';

import { AiFillGithub } from 'react-icons/ai';
import { BsFillLightbulbFill } from 'react-icons/bs';
import { IconButton } from './IconButton';

export function Footer() {
    function toggleTheme() {
        // Toggle the current theme
        const current = getCookie(document.cookie, 'theme') || 'light';
        const invert = current === 'light' ? 'dark' : 'light';
        document.cookie = setCookie('theme', invert);

        // Update the html class attr to switch theme
        const hasTheme = document.documentElement.classList.contains(current);
        document.documentElement.classList[hasTheme ? 'replace' : 'add'](current, invert);
    }

    return <Container
        elementName="header"
        parentClassName="bg-yellow-300 dark:!bg-slate-900 dark:!text-white"
        childClassName="container mx-auto p-5 flex flex-col gap-5 lg:flex-row"
    >
        <div className="text-center p-auto w-full">
            <IconButton onClick={toggleTheme}>
                <BsFillLightbulbFill />
            </IconButton>
            <IconButton href="https://github.com/covidinnz">
                <AiFillGithub />
            </IconButton>
        </div>

        <div className="text-center p-auto w-full">
            Data displayed on this site is sourced from the
            <br />
            <Link href="https://health.govt.nz/" target="_blank">
                Ministry Of Health
            </Link>
            .
        </div>

        <div className="text-center p-auto w-full">
            Site design and logo
            <br />© 2021-2022 COVID in New Zealand
        </div>
    </Container>;
}
