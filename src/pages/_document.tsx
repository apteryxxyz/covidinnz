import { Html, Head, Main, NextScript, DocumentProps } from 'next/document'

export default function _Document(props: DocumentProps) {
    const theme = props["__NEXT_DATA__"]["props"]["pageProps"]["theme"];
    return <Html className={theme}>
        <Head />
        <body className="bg-yellow-300 dark:bg-slate-900">
            <Main />
            <NextScript />
        </body>
    </Html>;
}
