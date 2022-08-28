import type { PropsWithChildren } from 'react';

export function SectionGrid(props: PropsWithChildren) {
    return <div className="masonry-container">{props.children}</div>;
}
