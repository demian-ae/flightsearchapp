import { Box, CircularProgress, Typography } from "@mui/material"
import { Itinerary, Segment, TravelerPricing } from "../models/FlightOffer"
import { format } from 'date-fns'
import { useEffect, useState } from "react"
import { getAirlines, getAirport } from "../api/amadeus.api"
import axios from "axios"
import { Airline } from "../models/Airline"
import { SegmentDetailedView } from "./SegmentDetailedView"
import { LayoverInfo } from "../models/LayoverInfo"

interface ItineraryInfoProps {
	itinerary: Itinerary,
	travelerPricing: TravelerPricing[]
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
	return { carrier, operating };
}

export const ItineraryInfoDetailed = ({ itinerary, travelerPricing }: ItineraryInfoProps) => {
	const duration = formatDuration(itinerary.duration);

	const layoversInfo = calculateLayovers(itinerary.segments);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'inline', padding: 2, borderBottom: 1, borderColor: 'grey.300'}}>
			<Box sx={{ display: 'flex', flexDirection: 'column', width:'100%'}}>
				{/* Duration of Entire Journey */}
				<Typography variant="h6" sx={{ fontStyle: 'italic', marginTop: 1 }} >
					<strong>Duration:</strong> {duration}
				</Typography>

				{/* itinerary.map => return segment and lay over text */}
				{itinerary.segments.map((segment, index) => {
					if (index >= 1) {
						return (<SegmentDetailedView key={index} segment={segment} layOverInfo={layoversInfo[index - 1]} travelerPricings={travelerPricing} />)
					}
					return (<SegmentDetailedView key={index} segment={segment} layOverInfo={null} travelerPricings={travelerPricing}/>)
				})}
			</Box>
		</Box>
	)
}