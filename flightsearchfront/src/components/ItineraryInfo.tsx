import { Box, CircularProgress, Typography } from "@mui/material"
import { Itinerary, Segment } from "../models/FlightOffer"
import { format } from 'date-fns'
import { useEffect, useState } from "react"
import { getAirlines, getAirport } from "../api/amadeus.api"
import axios from "axios"
import { Airline } from "../models/Airline"
import { LayoverInfo } from "../models/LayoverInfo"

interface ItineraryInfoProps {
	itinerary: Itinerary
}

interface AirlinesInfo { // can be the code or the full name
	carrier: string, 
	operating: string | null
}

// Function to format duration (PT4H2M -> 4 hours 2 minutes)
const formatDuration = (duration: string) => {
	const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
	const match = duration.match(regex);
	if (match) {
		const hours = match[1] ? `${match[1]} hours` : '';
		const minutes = match[2] ? `${match[2]} minutes` : '';
		return [hours, minutes].filter(Boolean).join(' ');
	}
	return 'N/A';
}

// Function to calculate layover duration between segments
const calculateLayovers = (segments: Segment[]): LayoverInfo[] => {
	const layoverInfos: LayoverInfo[] = [];

	for (let i = 0; i < segments.length - 1; i++) {
		const currentSegment = segments[i];
		const nextSegment = segments[i + 1];

		// Convert the departure and arrival times to Date objects
		const arrivalTime = new Date(currentSegment.arrival.at);
		const departureTime = new Date(nextSegment.departure.at);

		// Calculate the layover duration (difference between departure and arrival)
		const layoverDuration = departureTime.getTime() - arrivalTime.getTime();

		if (layoverDuration > 0) {
			const hours = Math.floor(layoverDuration / (1000 * 60 * 60));
			const minutes = Math.floor((layoverDuration % (1000 * 60 * 60)) / (1000 * 60));

			// Format the layover duration string
			const formattedDuration = `${hours} hours ${minutes} minutes`;

			// Push the layover info to the result array
			layoverInfos.push({
				iataCode: currentSegment.arrival.iataCode, // Layover is at the arrival airport of the current segment
				duration: formattedDuration,
			});
		}
	}

	return layoverInfos;
};

const getAirLinesCodes = (firstSegment: Segment): AirlinesInfo => {
	const carrier = firstSegment.carrierCode;
	let operating = null;
	if (firstSegment.operating) {
		operating = firstSegment.operating.carrierCode;
	}
	return {carrier, operating};
}

export const ItineraryInfo = ({ itinerary }: ItineraryInfoProps) => {
	const firstSegment = itinerary.segments[0];
	const lastSegment = itinerary.segments[itinerary.segments.length - 1];
	const duration = formatDuration(itinerary.duration);

	const departureTime = format(new Date(firstSegment.departure.at), 'MMM dd, yyyy hh:mm a');
	const arrivalTime = format(new Date(lastSegment.arrival.at), 'MMM dd, yyyy hh:mm a');

	const layoversInfo = calculateLayovers(itinerary.segments);

	const [departureAirport, setDepartureAirport] = useState('');
	const [arrivalAirport, setArrivalAirport] = useState('');
	
	const [carrierAirline, setCarrierAirline] = useState<Airline | undefined>(undefined);
	const [operatingAirline, setOperatingAirline] = useState<Airline | undefined>(undefined);

	const [loading, setLoading] = useState(false);

	const airlinesCodes = getAirLinesCodes(firstSegment);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			const outDeparture = getAirport(firstSegment.departure.iataCode);
			const outArrival = getAirport(lastSegment.arrival.iataCode);
			const outAirlineCarrier = getAirlines(airlinesCodes.carrier);
			const outAirlineOperating = getAirlines(airlinesCodes.operating);

			try {
				const resDeparture = await outDeparture.catch(err => {
					console.error("Failed to fetch departure data", err);
					return null;
				});
				if (resDeparture) {
					const airport = resDeparture;
					if (airport) {
						setDepartureAirport(`${airport.name} (${airport.iataCode})`);
					}
				}

				const resArrival = await outArrival.catch(err => {
					console.error("Failed to fetch arrival data", err);
					return null; 
				});
				if (resArrival) {
					const airport = resArrival;
					if (airport) {
						setArrivalAirport(`${airport.name} (${airport.iataCode})`);
					}
				}

				const resAirlinesCarrier = await outAirlineCarrier.catch(err => {
					console.error("Failed to fetch airline data", err);
					return null;
				});
				if (resAirlinesCarrier) {
					setCarrierAirline(resAirlinesCarrier);
				}

				const resAirlinesOperating = await outAirlineOperating.catch(err => {
					console.error("Failed to fetch airline data", err);
					return null;
				});
				if (resAirlinesOperating) {
					setOperatingAirline(resAirlinesOperating);
				}
			} catch (err) {
				if (!axios.isCancel(err)) {
					console.error(err);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);



	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: 'inline', padding: 2, borderBottom: 1, borderColor: 'grey.300' }}>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'inline', padding: 2, borderBottom: 1, borderColor: 'grey.300' }}>
			<Box sx={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column' }}>
				{/* Display First Segment (Departure) */}
				<Typography sx={{ marginTop: 1 }}>
					<strong>Departure:</strong> {departureTime} <br />
					<i><strong>{departureAirport}</strong></i> {firstSegment.departure.terminal ? 'Terminal ' + firstSegment.departure.terminal : ''}
				</Typography>

				{/* Display Last Segment (Arrival) */}
				<Typography>
					<strong>Arrival:</strong> {arrivalTime} <br />
					<i><strong>{arrivalAirport}</strong></i> {lastSegment.departure.terminal ? 'Terminal ' + lastSegment.departure.terminal : ''}
				</Typography>
				{/* Carrier Information */}
				<Typography sx={{ fontStyle: 'italic', marginTop: 1 }}>
					<strong>Carrier:</strong> {carrierAirline?.commonName} {operatingAirline ? operatingAirline.iataCode !== carrierAirline?.iataCode? `Operating: ${operatingAirline.commonName}` :``:``}
				</Typography>
			</Box>
			<Box sx={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
				{/* Duration of Entire Journey */}
				<Typography sx={{ fontStyle: 'italic', marginTop: 1 }} >
					<strong>Duration:</strong> {duration}
				</Typography>

				{/* Display Route for each segment */}
				{layoversInfo.map((layover, index) => (
					<Typography key={index}>
						{layover.duration} in {layover.iataCode}
					</Typography>
				))}
			</Box>
		</Box>
	)
}