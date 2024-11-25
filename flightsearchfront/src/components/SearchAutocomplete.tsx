import axios from 'axios';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react'

import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";

import { getLocations } from '../api/amadeus.api';
import { AmadeusLocation } from '../models/AmadeusLocation';


interface SearchAutocompleteProps {
    handleChoice: React.Dispatch<React.SetStateAction<AmadeusLocation | null>>,
    display: string,
    value: AmadeusLocation | null
}

export const SearchAutocomplete = ({ handleChoice, display, value }: SearchAutocompleteProps) => {
    const [options, setOptions] = useState<AmadeusLocation[]>([]);
    const [search, setSearch] = useState('')
    const [keyword, setKeyword] = useState('')
    const [loading, setLoading] = useState(false)

    // Debounce func prevents extra unwanted keystrokes, when user triggers input events 
    const debounceLoadData = useCallback(debounce(setKeyword, 500), []);

    // Trigger debounced keyword update when search changes
    useEffect(() => {
        debounceLoadData(search);
    }, [search]);

    // Fetch data based on the keyword
    useEffect(() => {
        setLoading(true);
        const { out, source } = getLocations(keyword);

        out
            .then((res) => {
                if (!res.data.code) {
                    setOptions(res.data);
                }
            })
            .catch((err) => {
                if (!axios.isCancel(err)) {
                    console.error(err);
                }
                setOptions([]);
            })
            .finally(() => {
                setLoading(false)
            });


        return () => {
            source.cancel();
        };
    }, [keyword]);


    return (
        <Autocomplete
            id={"search-autocomplete-" + display}
            value={value}
            style={{ width: 300 }}
            options={options}
            getOptionLabel={(option) => (`(${option.iataCode}) ${option.name}`)}
            onChange={(e, value) => {
                if (value && value.name) {
                    handleChoice(value);
                    setSearch(value.name);
                    return;
                }
                setSearch('');
                handleChoice(null);
            }}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={display}
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