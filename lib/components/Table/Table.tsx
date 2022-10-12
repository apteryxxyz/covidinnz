// I'd like to remove the need for MUI and write tables myself,
// but I've already made this and can't be bothered rn

import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';

import type { PropsWithChildren } from 'react';
import type { LeftTableProps } from './Left';
import { LeftTable } from './Left';
import type { TopTableProps } from './Top';
import { TopTable } from './Top';

export const HeadClass = '';
export const BodyClass = 'dark:!bg-slate-900';
export const SortClass = 'dark:!text-white [&>svg]:!text-white [&>svg]:hover:!text-slate-300';
export const RowClass = 'dark:!bg-slate-800 [&>*]:dark:!text-white';
export const CellClass = 'dark:!border-y-slate-900';

export interface BaseTableProps {
    type: 'top' | 'left';
    headers: {
        name: string;
        field: string;
        type: string;
        flex?: number;
        sortable?: number;
    }[];
    cells: Record<string, any>[];
}

export type TableProps = LeftTableProps | TopTableProps;

export function Table(props: PropsWithChildren<TableProps>) {
    function SwitchTable() {
        switch (props.type) {
            case 'top':
                return <TopTable {...props} />;
            case 'left':
                return <LeftTable {...props} />;
            default:
                throw 'No table type specified';
        }
    }

    return <TableContainer
        component={Paper}
        sx={{
            width: '100%',
            overflowX: 'none',
            '& .MuiTableRow-root:nth-child(even)': {
                backgroundColor: '',
            },
            '& .MuiTableRow-root:nth-child(odd)': {
                backgroundColor: 'rgb(253 224 71 / 1)',
            },
        }}
    >
        <SwitchTable />
    </TableContainer>;
}
