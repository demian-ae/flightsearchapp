import { Autocomplete, TextField } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { debounce } from 'lodash';
import { getAmadeusData } from "../api/amadeus.api";
import axios from "axios";
import { Option } from "./SearchAutocomplete";



const dataToOptions = (data: Option[]) => {
    return data.map((d) => ({
        iataCode: d.iataCode,
        name: d.name
    }))
}

export const SearchAutocomplete2 = () => {
    const [keywords, setKeywords] = useState('');
    const [iataCode, setIataCode] = useState('')
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<{ iataCode: string, name: string }[]>([])

    const debouncedChangeHandler = useCallback(
        debounce((k: string) => {
            setLoading(true);
            const { out, source } = getAmadeusData({
                keyword: k,
                page: 0,
                city: true,
                airport: true,
            });

            out
                .then((res) => {
                    if (!res.data.code) {
                        setOptions(dataToOptions(res.data.data));
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

            console.log(options)

            return () => {
                source.cancel();
            };
        }, 500),
        []
    );

    const handleChange = (t: string) => {
        setKeywords(t);
        debouncedChangeHandler(t);
    }

    return (
        <>
            <p>Keywords: {keywords}, IATA code: {iataCode}</p>
            <Autocomplete
                disablePortal
                options={options}
                getOptionLabel={(option) => (`(${option.iataCode}) ${option.name}`)}
                sx={{ width: 300, marginBottom: '1rem' }}
                renderInput={
                    (params) =>
                        <TextField
                            {...params}
                            onChange={(e) => {
                                e.preventDefault();
                                handleChange(e.target.value)
                            }}
                            label="Search city/airport" />
                }
                loading={loading}
                onChange={(e, value) => {
                    if (value) {
                        setIataCode(value.iataCode)
                        return;
                    }
                    setIataCode('');
                }}
            />

        </>
    )
}
