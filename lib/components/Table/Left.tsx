import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import type { PropsWithChildren } from 'react';
import { BodyClass, BaseTableProps, CellClass, RowClass } from './Table';

export type LeftTableProps = BaseTableProps & { type: 'left' };

export function LeftTable({ headers, cells }: PropsWithChildren<LeftTableProps>) {
    return <Table size="small">
        <TableBody className={BodyClass}>
            {headers.map((header, i) => <TableRow key={i} className={RowClass}>
                <TableCell key={i} style={{ flex: header.flex }} className={CellClass}>
                    {header.name}
                </TableCell>

                {cells.map((row, j) => <TableCell
                    key={j}
                    align={header.type === 'number' ? 'right' : 'left'}
                    style={{ flex: header.flex }}
                    className={CellClass}
                >
                    {row[header.field]}
                </TableCell>)}
            </TableRow>)}
        </TableBody>
    </Table>;
}
