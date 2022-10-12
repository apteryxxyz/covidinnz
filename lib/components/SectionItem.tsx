import type { PropsWithChildren } from 'react';
import { HiLink, HiOutlineArrowsExpand } from 'react-icons/hi';
import { IconButton } from './IconButton';

export interface ItemProps {
    title: any;
    url?: string;
    full?: boolean;
}

export function SectionItem(props: PropsWithChildren<ItemProps>) {
    let { title } = props;
    const isHttp = props.url && props.url.startsWith('http');
    const icon = isHttp ? <HiLink /> : <HiOutlineArrowsExpand />;
    if (props.url)
        title = <>
            {props.title}
            <IconButton href={props.url}>{icon}</IconButton>
        </>;

    return <section className="masonry-item whitespace-pre-wrap [&>*]:my-2 [&>h2]:text-xl">
        <h1 className="text-3xl font-semibold flex flex-row justify-between">{title}</h1>
        {props.children}
    </section>;
}
