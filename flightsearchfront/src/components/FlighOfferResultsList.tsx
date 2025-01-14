import { CircularProgress, Typography, Box, Stack, Pagination } from "@mui/material";
import { FlightOffer } from "../models/FlightOffer";
import { FlightOfferCard } from "./FlightOfferCard";
import { useState } from "react";
import { OrderButtons } from "./OrderButtons";

interface FlighOfferResultsListProps {
	flighOfferResults: FlightOffer[] | null;
	isLoading: boolean;
	isError: boolean;
	setCurrFlighOffer: React.Dispatch<React.SetStateAction<FlightOffer | undefined>>;
}

// Helper to parse ISO 8601 duration to total minutes
const parseDuration = (duration: string): number => {
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
	const hours = parseInt(match?.[1] || "0", 10);
	const minutes = parseInt(match?.[2] || "0", 10);
	return hours * 60 + minutes;
};

const sortOffers = (
	offers: FlightOffer[],
	orderPrice: string,
	orderDuration: string
): FlightOffer[] => {
	let sortedOffers = [...offers];

	if (orderPrice !== "none") {
		sortedOffers.sort((a, b) => {
			const priceA = parseFloat(a.price.total);
			const priceB = parseFloat(b.price.total);

			// Primary sorting by price
			const priceComparison = orderPrice === "asc" ? priceA - priceB : priceB - priceA;
			if (priceComparison !== 0) return priceComparison;

			// Secondary sorting by duration if prices are equal
			if (orderDuration !== "none") {
				const durationA = a.itineraries.reduce(
					(sum, itinerary) => sum + parseDuration(itinerary.duration),
					0
				);
				const durationB = b.itineraries.reduce(
					(sum, itinerary) => sum + parseDuration(itinerary.duration),
					0
				);
				return orderDuration === "asc" ? durationA - durationB : durationB - durationA;
			}

			return 0;
		});
	} else if (orderDuration !== "none") {
		// Sort only by duration if price sorting is not applied
		sortedOffers.sort((a, b) => {
			const durationA = a.itineraries.reduce(
				(sum, itinerary) => sum + parseDuration(itinerary.duration),
				0
			);
			const durationB = b.itineraries.reduce(
				(sum, itinerary) => sum + parseDuration(itinerary.duration),
				0
			);
			return orderDuration === "asc" ? durationA - durationB : durationB - durationA;
		});
	}

	return sortedOffers;
};

export const FlighOfferResultsList = ({
	flighOfferResults,
	isLoading,
	isError,
	setCurrFlighOffer,
}: FlighOfferResultsListProps) => {
	const [page, setPage] = useState(1);
	const offersPerPage = 5;

	const [orderPrice, setOrderPrice] = useState<string>("none"); // none, asc, desc
	const [orderDuration, setOrderDuration] = useState<string>("none"); // none, asc, desc

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	// Apply sorting before pagination
	const sortedOffers = flighOfferResults ? sortOffers(flighOfferResults, orderPrice, orderDuration) : [];
	const startIndex = (page - 1) * offersPerPage;
	const paginatedOffers = sortedOffers.slice(startIndex, startIndex + offersPerPage);

	return (
		<Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100vw">
			{isLoading && (
				<>
					<CircularProgress size={80} />
					<Typography variant="h5" align="center" marginTop={4}>
						Loading flight offers, please wait...
					</Typography>
				</>
			)}

			{isError && (
				<Typography variant="h5" color="error" align="center" marginTop={4}>
					An error occurred while fetching flight offers. Please try again later.
				</Typography>
			)}

			{!isLoading && !isError && flighOfferResults && flighOfferResults.length === 0 && (
				<Typography variant="h5" align="center" marginTop={4}>
					No flight offers found. Please adjust your search criteria.
				</Typography>
			)}

			{!isLoading && !isError && flighOfferResults && flighOfferResults.length > 0 && (
				<Box marginTop={4} width="100%" display="flex" flexDirection="column" alignItems="center" gap={2}>
					<Box display="flex" flexDirection="row" alignContent="space-between">
						<OrderButtons
							orderPrice={orderPrice}
							orderDuration={orderDuration}
							setOrderDuration={setOrderDuration}
							setOrderPrice={setOrderPrice}
						/>
					</Box>
					{paginatedOffers.map((offer, index) => (
						<FlightOfferCard key={index} flightOffer={offer} setCurrFlighOffer={setCurrFlighOffer} />
					))}
					<Stack spacing={2}>
						<Pagination
							count={Math.ceil(sortedOffers.length / offersPerPage)}
							page={page}
							size="large"
							onChange={handleChange}
						/>
					</Stack>
				</Box>
			)}
		</Box>
	);
};
