import Link from 'next/link';
import { Container } from './Container';

const className =
    'flex items-center justify-center w-full h-14 text-lg' +
    'my-1 rounded-md transition-all hover:transition-all ' +
    'hover:bg-yellow-200 dark:hover:bg-slate-700';

export function NavigationBar() {
    return <Container
        elementName="nav"
        parentClassName="bg-yellow-300 shadow-lg dark:!bg-slate-900 dark:!text-white"
        childClassName="container mx-auto grid grid-cols-2 md:grid-cols-3 l?g:grid-cols-4 x?l:grid-cols-5"
    >
        <Link href="/">
            <a className={className}>Home</a>
        </Link>
        <Link href="/cases">
            <a className={className}>Cases</a>
        </Link>
        {/* <Link href="/testing">
            <a className={className}>Testing</a>
        </Link>
        <Link href="/hospitalisations">
            <a className={className}>Hospitalisations</a>
        </Link> */}
        <Link href="/vaccinations">
            <a className={className}>Vaccinations</a>
        </Link>
    </Container>;
}
