import { FlightOffer } from '../models/FlightOffer'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { ItineraryInfo } from './ItineraryInfo'

const getPricePerTraveler = (totalPrice: string, travelers: number) => {
	const totalPriceNumber = parseFloat(totalPrice);
	if (isNaN(totalPriceNumber) || totalPriceNumber <= 0 || travelers <= 0) {
		return "Error getting the price/traveler";
	}
	const pricePerTraveler = totalPriceNumber / travelers;
	return pricePerTraveler.toFixed(2);
}
function formatPrice(input: string): string {
	// Ensure the input is a valid number string
	if (!/^\d+(\.\d{1,2})?$/.test(input)) {
	  return("Invalid input format. Expected a numeric string like '19840.00'.");
	}
  
	// Split the input into integer and decimal parts
	const [integerPart, decimalPart] = input.split(".");
  
	// Format the integer part with commas
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
	// Return the formatted number with decimals if present
	return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

export const FlightOfferCard = ({ flightOffer }: { flightOffer: FlightOffer }) => {
	return (
		<Card sx={{ width: 1200 }}>
			<CardActionArea onClick={(e) => alert('clicked! ' + flightOffer.id)}>
				<CardContent>
					<Box sx={{ display: 'flex', w: '100%' }}>
						<Box sx={{ flex: '0 0 75%', p: 1, borderRight: 1, display: 'flex', flexDirection: 'column' }}> {/* Itinerarios */}
							{flightOffer.itineraries.map((itinerary, index) => <ItineraryInfo key={index} itinerary={itinerary} />)}
							{/* <ItineraryInfo itinerary={flightOffer.itineraries[1]} /> */}
						</Box>
						<Box sx={{ flex: '1', p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}> {/* precio total */}
							<Typography variant="h6" gutterBottom>
								Total:
							</Typography>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: 1 }}>
								{`${flightOffer.price.currency}$${formatPrice(flightOffer.price.grandTotal)}`}
							</Typography>

							<Typography variant="h6" gutterBottom>
								Per traveler:
							</Typography>
							<Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
								{`${flightOffer.price.currency}$${formatPrice(getPricePerTraveler(flightOffer.price.grandTotal, flightOffer.travelerPricings.length))}`}
							</Typography>
						</Box>
					</Box>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}
