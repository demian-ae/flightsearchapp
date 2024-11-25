import { useEffect, useState } from "react";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { currencyCodes } from "../utils/CurrencyCodes";
import { getFlightOffers } from "../api/amadeus.api";
import axios from "axios";
import { FlightOffer } from "../models/FlightOffer";
import { SearchQueryParams } from "../models/SearchQueryParams";

const today = dayjs();

interface SearchBarProps {
	setFlighOfferResults: React.Dispatch<React.SetStateAction<FlightOffer[] | null>>,
	setError: React.Dispatch<React.SetStateAction<boolean>>,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	searchQueryParams: SearchQueryParams,
	setSearchQueryParams: React.Dispatch<React.SetStateAction<SearchQueryParams>>
}

export const SearchBar = ({ setFlighOfferResults, setError, setIsLoading, searchQueryParams, setSearchQueryParams }: SearchBarProps) => {
	const [origin, setOrigin] = useState(searchQueryParams.origin);
	const [destination, setDestination] = useState(searchQueryParams.destination);
	const [departureDate, setDepartureDate] = useState<Dayjs | null>(searchQueryParams.departureDate);
	const [arrivalDate, setArrivalDate] = useState<Dayjs | null>(searchQueryParams.arrivalDate);
	const [passengers, setPassengers] = useState(searchQueryParams.passengers);
	const [currency, setCurrency] = useState<string>(searchQueryParams.currency);
	const [nonStop, setNonStop] = useState(searchQueryParams.nonStop);
	const [validForm, setValidForm] = useState(false);

	const handleSearch = () => {
		setIsLoading(true);
		if (!origin || !destination || !departureDate || !currency) {
			alert('Please fill in all required fields.');
			return;
		}

		const aux = {
			origin: origin, 
			destination: destination,
			departureDate: departureDate,
			arrivalDate: arrivalDate,
			passengers: passengers,
			currency: currency,
			nonStop: nonStop
		}
		console.log(aux)
		setSearchQueryParams(aux)

		const { out } = getFlightOffers({
			origin: origin? origin.iataCode : '',
			destination: destination? destination.iataCode: '',
			departDate: departureDate.format('YYYY-MM-DD'),
			returnDate: arrivalDate ? arrivalDate.format('YYYY-MM-DD') : undefined,
			currencyCode: currency,
			adults: passengers,
			nonStop,
		});

		out.then(response => {
			console.log('Flight offers:', response.data);
			setFlighOfferResults(response.data);
			setError(false);
		}).catch(error => {
			if (axios.isCancel(error)) {
				console.log('Request canceled:', error.message);
			} else {
				console.error('Error fetching flight offers:', error);
			}
			setFlighOfferResults(null);
			setError(true);
		}).finally(() => { 
			setIsLoading(false); 
		});
	};


	const setPassengersFilter = (n: number) => {
		if (n < 1) {
			setPassengers(1);
		} else if (n > 10) {
			setPassengers(10);
		} else {
			setPassengers(+n.toFixed())
		}
	}


	useEffect(() => {
		setValidForm(!origin || !destination || !departureDate || !currency)
	}, [origin, destination, departureDate, currency]);




	return (
		<Box
			sx={{
				display: "flex",
				p: 2,
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<FormControl error={false}>

			</FormControl>
			<Box sx={{ mx: 1 }}>
				<SearchAutocomplete handleChoice={setOrigin} display={'Origin'} value={origin}/>
			</Box>
			<Box sx={{ mx: 1 }}>
				<SearchAutocomplete handleChoice={setDestination} display={'Destination'} value={destination}/>
			</Box>
			<Box sx={{ mx: 1 }}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						value={departureDate}
						disablePast
						views={['year', 'month', 'day']}
						onChange={(newDate) => setDepartureDate(newDate)}
						label="Departure"
						slotProps={{
							field: { clearable: true, onClear: () => setDepartureDate(null) }
						}}
					></DatePicker>
					<DatePicker
						value={arrivalDate}
						minDate={departureDate ? departureDate : today.add(1, 'day')}
						views={['year', 'month', 'day']}
						onChange={(newDate) => setArrivalDate(newDate)}
						label="Arrival"
						slotProps={{
							field: { clearable: true, onClear: () => setArrivalDate(null) }
						}}
					></DatePicker>
				</LocalizationProvider>
			</Box>
			<Box sx={{ mx: 1 }}>
				<TextField
					id="outlined-number"
					label="Adults"
					type="number"
					slotProps={{
						inputLabel: {
							shrink: true,
						}
					}}
					sx={{ width: 70 }}
					value={passengers}
					onChange={(e) => setPassengersFilter(+e.target.value)}
				/>
			</Box>
			<Box sx={{ mx: 1 }}>
				<Autocomplete
					options={currencyCodes}
					defaultValue={"MXN"}
					sx={{ width: 120 }}
					onChange={(e, value) => {
						if (value) {
							setCurrency(value);
							return;
						}
						setCurrency("");
					}}
					renderInput={(params) => <TextField {...params} label="Currency" />}
				/>
			</Box>
			<Box sx={{ mx: 1 }}>
				<FormControlLabel
					label="Non-stops"
					control={
						<Checkbox
							checked={nonStop}
							onChange={(e) => {
								setNonStop(e.target.checked)
							}}
						/>
					}
				/>
			</Box>
			<Box sx={{ mx: 1 }}>
				<Button
					variant="contained"
					onClick={(e) => handleSearch()}
					disabled={validForm}
				>
					Search
				</Button>
			</Box>
		</Box>
	);
};
