import { CircularProgress, Typography, Box } from "@mui/material";
import { FlightOffer } from "../models/FlightOffer";
import { FlightOfferCard } from "./FlightOfferCard";
import { useNavigate } from "react-router";

interface FlighOfferResultsListProps {
	flighOfferResults: FlightOffer[] | null;
	isLoading: boolean;
	isError: boolean;
	setCurrFlighOffer: React.Dispatch<React.SetStateAction<FlightOffer | undefined>>
}

export const FlighOfferResultsList = ({
	flighOfferResults,
	isLoading,
	isError,
	setCurrFlighOffer
}: FlighOfferResultsListProps) => {
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
					{/* Render flight offers here, replace with your rendering logic */}
					<Typography variant="h6" >
						Flight offers:
					</Typography>
					{flighOfferResults.map((offer, index) => (
						<FlightOfferCard key={index} flightOffer={offer} setCurrFlighOffer={setCurrFlighOffer} />
					))}
				</Box>
			)}
		</Box>
	);
};
