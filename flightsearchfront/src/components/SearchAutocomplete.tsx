import axios from 'axios';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react'

import { Autocomplete } from "@mui/material";
import { TextField, CircularProgress } from "@mui/material";


import { getAmadeusData } from '../api/amadeus.api';
import { Search } from '../pages/SearchRoot';


interface SearchAutocompleteProps {
    search: Search
    setSearch: React.Dispatch<React.SetStateAction<Search>>;
}

// Define the option type
interface Option {
    subType?: string; // Add this property
    type?: string; // Keep this optional since it's derived
    name: string;
    iataCode: String
}


export const SearchAutocomplete = (props: SearchAutocompleteProps) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [search, setSearch] = useState('')
    const [keyword, setKeyword] = useState('')
    const [loading, setLoading] = useState(false)

    // Configure options format for proper displaying on the UI
    // const names: Option[] = options.map((i) => ({ type: i.subType, name: i.name }));

    // Debounce func prevents extra unwanted keystrokes, when user triggers input events 
    const debounceLoadData = useCallback(debounce(setKeyword, 1000), []);

    // Trigger debounced keyword update when search changes
    useEffect(() => {
        debounceLoadData(search);
    }, [search]);

    // Fetch data based on the keyword
    useEffect(() => {
        setLoading(true);
        const { out, source } = getAmadeusData({ ...props.search, page: 0, keyword });

        out
            .then((res) => {
                if (!res.data.code) {
                    setOptions(res.data.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                if (!axios.isCancel(err)) {
                    console.error(err);
                }
                setOptions([]);
                setLoading(false);
            });

            console.log(options.map((i) => ({ type: i.subType, name: i.name })));

        return () => {
            source.cancel();
        };
    }, [keyword]);

    // Destructure props for convenience
    const { city, airport } = props.search;

    // Determine label based on search criteria
    const label = city && airport ? "City and Airports" : city ? "City" : airport ? "Airports" : "";


    return (
        <Autocomplete
            id="search-autocomplete"
            style={{ width: 300, marginBottom: '1rem' }}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name && option.type === value.type}
            onChange={(e, value) => {
                if (value && value.name) {
                    props.setSearch((p) => ({ ...p, keyword: value.name, page: 0 }));
                    setSearch(value.name);
                    return;
                }
                setSearch('');
                props.setSearch((p) => ({ ...p, keyword: 'a', page: 0 }));
            }}
            options={options.map((i) => ({ type: i.subType, name: `(${i.iataCode}) ${i.name}` }))}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    fullWidth
                    onChange={(e) => {
                        e.preventDefault();
                        setSearch(e.target.value);
                    }}
                    variant="outlined"
                />
            )}
        />
    )
}
