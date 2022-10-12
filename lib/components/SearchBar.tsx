import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';

import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';

export interface SearchBarProps {
    [key: string]: unknown;
    onCancel: () => void;
    onChange: (value: string) => void;
    onRequest?: (value: string) => void;
    onKeyUp?: (event: any) => void;
    value: string;
}

export function SearchBar({
    onCancel,
    onChange,
    onRequest,
    onKeyUp,
    ...inputProps
}: PropsWithChildren<SearchBarProps>) {
    const inputRef = useRef();
    const [value, setValue] = useState<string>(inputProps.value);
    useEffect(() => void setValue(inputProps.value), [inputProps.value]);

    const handleInput = useCallback((e: any) => {
        setValue(e.target.value);
        onChange(e.target.value);
    }, [onChange]);

    const handleCancel = useCallback(() => {
        setValue('');
        onCancel();
    }, [onCancel]);

    const handleRequest = useCallback(() => {
        if (onRequest) onRequest(value);
    }, [onRequest, value]);

    const handleKeyUp = useCallback((e: any) => {
        if (e.charCode === 13 || e.key === 'Enter') handleRequest();
        else if (e.charCode === 27 || e.key === 'Escape') handleCancel();
        if (onKeyUp) onKeyUp(e);
    }, [handleRequest, handleCancel, onKeyUp]);

    return <Paper className="h-12 flex flex-row">
        <div className="m-auto pl-5 w-full">
            <Input
                {...inputProps}
                inputRef={inputRef}
                value={value}
                onChange={(e) => handleInput(e)}
                onKeyUp={(e) => handleKeyUp(e)}
                fullWidth
                disableUnderline
            />
        </div>

        <IconButton onClick={handleRequest}>
            <AiOutlineSearch />
        </IconButton>

        <IconButton onClick={handleCancel}>
            <AiOutlineDelete />
        </IconButton>
    </Paper>;
}
