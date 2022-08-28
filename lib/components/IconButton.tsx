import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export interface IconButtonProps {
    onClick?: (..._: unknown[]) => unknown;
    href?: string;
}

export function IconButton(props: PropsWithChildren<IconButtonProps>) {
    return <button
        onClick={props.onClick}
        className="text-3xl p-2 transition-all rounded-3xl hover:bg-slate-700/10 dark:hover:bg-slate-300/10"
    >
        {props.href ? (
            <Link href={props.href} target={props.href.startsWith('http') ? '_blank' : ''}>
                <a href={props.href} target={props.href.startsWith('http') ? '_blank' : ''} rel="noreferrer">
                    {props.children}
                </a>
            </Link>
        ) : (
            <>{props.children}</>
        )}
    </button>;
}
