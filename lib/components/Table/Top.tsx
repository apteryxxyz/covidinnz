import { SearchBar } from '@components/SearchBar';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import type { PropsWithChildren} from 'react';
import { useState } from 'react';
import type { BaseTableProps} from './Table';
import { BodyClass, CellClass, HeadClass, RowClass, SortClass } from './Table';

export type TopTableProps = BaseTableProps & {
    type: 'top';
    searchProp?: string;
    defaultOrderBy: string;
    defaultOrder?: 'asc' | 'desc';
};

export function TopTable({ headers, cells, ...restProps }: PropsWithChildren<TopTableProps>) {
    const [orderBy, setOrderBy] = useState(restProps.defaultOrderBy);
    const [order, setOrder] = useState(restProps.defaultOrder || 'desc');
    const [rows, setRows] = useState(cells);
    const [query, setQuery] = useState('');

    function requestSort(_: any, prop: string) {
        const isAsc = orderBy === prop && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(prop);
    }

    function requestSearch(q: string) {
        const { searchProp } = restProps;
        if (searchProp) {
            const filtered = cells.filter((r) =>
                r[searchProp] //
                    .toLowerCase()
                    .includes(q.toLowerCase()),
            );
            setRows(filtered);
        }
    }

    function cancelSearch() {
        setQuery('');
        requestSearch('');
    }

    function sortRows() {
        const copy = [...rows].sort(getComparator(order, orderBy));
        // Always keep the total at the bottom of the table
        const totalIndex = copy.findIndex(f => Object.values(f).includes('Total'));
        copy.push(copy.splice(totalIndex, 1)[0]);
        return copy;
    }

    return <>
        {restProps.searchProp && <SearchBar
            placeholder="Search"
            value={query}
            onChange={(q) => requestSearch(q)}
            onCancel={() => cancelSearch()}
        />}

        <Table size="small">
            <TableHead className={HeadClass}>
                <TableRow className={RowClass}>
                    {headers.map((header) => <TableCell
                        key={header.field}
                        align={header.type === 'number' ? 'right' : 'left'}
                        style={{ flex: header.flex }}
                        sortDirection={orderBy === header.field ? order : false}
                        className={CellClass}
                    >
                        {header.sortable ? (
                            <TableSortLabel
                                active={orderBy === header.field}
                                direction={orderBy === header.field ? order : 'asc'}
                                onClick={(e) => requestSort(e, header.field)}
                                className={SortClass}
                            >
                                {header.name}
                            </TableSortLabel>
                        ) : (
                            header.name
                        )}
                    </TableCell>)}
                </TableRow>
            </TableHead>

            <TableBody className={BodyClass}>
                {sortRows()
                    .map((row, i) => <TableRow key={i} className={RowClass}>
                        {headers.map((header, j) => <TableCell
                            key={j}
                            align={header.type === 'number' ? 'right' : 'left'}
                            style={{ flex: header.flex }}
                            className={CellClass}
                        >
                            {row[header.field]}
                        </TableCell>)}
                    </TableRow>)}
            </TableBody>
        </Table>
    </>;
}

function descendingComparator(a: Record<string, any>, b: Record<string, any>, orderBy: string) {
    let c = a[orderBy];
    let d = b[orderBy];
    const to = (e: string) => Number(`${e}`.split(' ')[0].replace(/,|%/g, ''));
    if (to(c) || to(d)) {
        c = to(c);
        d = to(d);
    }

    if (typeof c === 'number') {
        if (c < d) return -1;
        if (c > d) return 1;
    }

    if (typeof c === 'string') {
        return c.localeCompare(d);
    }

    return 0;
}

function getComparator(order: 'asc' | 'desc', orderBy: string) {
    return order === 'desc'
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}
