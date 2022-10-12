import type { PropsWithChildren } from 'react';
import React from 'react';

export interface ContainerProps {
    elementName: string;
    parentClassName: string;
    childClassName: string;
}

export function Container(props: PropsWithChildren<ContainerProps>) {
    const child = React.createElement(
        props.elementName,
        { className: props.childClassName },
        props.children,
    );

    return <div className={props.parentClassName}>{child}</div>;
}
