import axios from 'axios';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react'

import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";

import { getLocations } from '../api/amadeus.api';
import { AmadeusLocation } from '../models/AmadeusLocation';


interface SearchAutocompleteProps {
    handleChoice: React.Dispatch<React.SetStateAction<string>>,
    display: string,
    value: string
}

export const SearchAutocomplete = ({ handleChoice, display, value }: SearchAutocompleteProps) => {
    const [currValue, setCurrValue] = useState<AmadeusLocation>({
        type: '',
        subType: '',
        name: '',
        iataCode: value
    })
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
            value={currValue}
            style={{ width: 300 }}
            options={options}
            getOptionLabel={(option) => (`(${option.iataCode}) ${option.name}`)}
            onChange={(e, value) => {
                if (value && value.name) {
                    handleChoice(value.iataCode);
                    setSearch(value.name);
                    return;
                }
                setSearch('');
                handleChoice('');
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