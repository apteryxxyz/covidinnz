import Head from 'next/head';
import type { AppProps } from 'next/app';
import { StrictMode } from 'react';

import { Container } from '@components/Container';
import { Header } from '@components/Header';
import { NavigationBar } from '@components/NavigationBar';
import { Footer } from '@components/Footer';

import '../styles/globals.css';

const meta = {
    title: 'COVID in New Zealand',
    description: 'A source for COVID-19 in New Zealand related statistics',
    url: 'https://covidinnz.com/',
    keywords: 'aotearoa, new zealand, covid, covid-19 coronavirus, stats, cases, vaccinations',
    image: '/images/banner_yellow.png',
};

export default function _App({ Component, pageProps }: AppProps) {
    return <StrictMode>
        <Head>
            {/* This causes a "next-head-count" warning, but this is the
            easiest way I found to implement server side dark mode */}
            {/* <html className={pageProps.theme} /> */}
            <link rel="shortcut icon" href="/images/logo_yellow.png" />

            <title>{meta.title}</title>
            <meta name="title" content={meta.title} />
            <meta name="keywords" content={meta.keywords} />
            <meta name="description" content={meta.description} />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={meta.title} />
            <meta property="og:url" content={meta.url} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:image" content={meta.image} />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:url" content={meta.url} />
            <meta name="twitter:title" content="Sheets.gg" />
            <meta name="twitter:image" content={meta.image} />
            <meta name="twitter:description" content={meta.url} />
        </Head>

        <Header {...pageProps} />

        <NavigationBar />

        <Container
            elementName="main"
            parentClassName="bg-white dark:bg-slate-900 dark:text-white"
            childClassName="container mx-auto p-5 flex flex-col"
        >
            <Component {...pageProps} />
        </Container>

        <Footer />
    </StrictMode>;
}
