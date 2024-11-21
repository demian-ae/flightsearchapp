import { useEffect, useState } from "react";
import { SearchAutocomplete } from "../components/SearchAutocomplete";
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Input, TextField, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { currencyCodes } from "../utils/CurrencyCodes";

const today = dayjs();

export const SearchRoot = () => {
	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');
	const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
	const [arrivalDate, setArrivalDate] = useState<Dayjs | null>(null);
	const [passengers, setPassengers] = useState(1);
	const [currency, setCurrency] = useState<string>('MXN');
	const [nonStops, setNonStops] = useState(false);

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
		console.log("origin:", origin);
		console.log("destination:", destination);
	}, [origin, destination]);

	useEffect(() => {
		console.log('departure date:', departureDate?.format('YYYY-MM-DD'));
		console.log('arrival date:', arrivalDate?.format('YYYY-MM-DD'));
	}, [departureDate, arrivalDate])

	useEffect(() => {
		console.log('Passengers: ', passengers)
	}, [passengers])

	useEffect(() => {
		console.log('Currenncy code:', currency);
	}, [currency])




	return (
		<Box
			sx={{
				display: "flex",
				bgcolor: "#f5f5f5",
				p: 2,
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<FormControl error={false}>

			</FormControl>
			<Box sx={{ mx: 1 }}>
				<SearchAutocomplete handleChoice={setOrigin} display={'Origin'} />
			</Box>
			<Box sx={{ mx: 1 }}>
				<SearchAutocomplete handleChoice={setDestination} display={'Destination'} />
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
							checked={nonStops}
							onChange={(e) => {
								setNonStops(e.target.checked)
							}}
						/>
					}
				/>
			</Box>
			<Box sx={{ mx: 1 }}>
				<Button variant="contained">
					Search
				</Button>
			</Box>
		</Box>
	);
};
