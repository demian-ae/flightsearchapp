import { Box, Button, Container, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FlightOffer } from '../models/FlightOffer';
import { formatPrice, getPricePerTraveler } from '../components/FlightOfferCard';
import { ItineraryInfoDetailed } from '../components/ItineraryInfoDetailed';
import { useNavigate } from 'react-router';

interface FlightOfferDetailsProps {
	flightOffer: FlightOffer | undefined,
}

export const FlightOfferDetails = ({ flightOffer }: FlightOfferDetailsProps) => {
	let navigate = useNavigate();

	if (!flightOffer) {
		return (
			<Typography variant="h5" color="error" align="center" marginTop={4}>
				An error occurred while fetching flight offers. Please try again later.
			</Typography>
		)
	}

	return (
		<Container>
			<Box width="100%" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<Button
					variant='contained'
					startIcon={<ArrowBackIcon />}
					onClick={() => (navigate('/'))}
				>
					Back
				</Button>
				<Typography variant="h5" sx={{ pl: 2 }} >
					Flight Offer Detailed view
				</Typography>
			</Box>

			<Box sx={{ display: 'flex', w: '100%' }}>
				<Box sx={{ flex: '0 0 75%', p: 1, borderRight: 1, display: 'flex', flexDirection: 'column', width: '100%' }}> {/* Itinerarios */}
					{flightOffer.itineraries.map((itinerary, index) => (
						<ItineraryInfoDetailed key={index} itinerary={itinerary} travelerPricing={flightOffer.travelerPricings} />
					))}
				</Box>


				<Box sx={{ flex: '1', p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}> {/* precio total */}
					<Typography variant="h6" gutterBottom>
						Base: {`${flightOffer.price.currency}$${formatPrice(flightOffer.price.base)}`}
					</Typography>
					<Typography variant="h6" gutterBottom>
						Fees:
					</Typography>
					{flightOffer.price.fees.map((fee) => (
						<Typography gutterBottom>
							{`(${fee.type})`} {`${flightOffer.price.currency}$${formatPrice(fee.amount)}`}
						</Typography>
					))}

					<Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderTop: 1 }}>
						Total: {`${flightOffer.price.currency}$${formatPrice(flightOffer.price.grandTotal)}`}
					</Typography>

					<Typography variant="h6" gutterBottom>
						Per traveler:
					</Typography>
					{flightOffer.travelerPricings.map((traveler) => (
						<Typography gutterBottom>
							Traveler {traveler.travelerId}: {`${flightOffer.price.currency}$${formatPrice(traveler.price.total)}`}
						</Typography>
					))}
				</Box>
			</Box>
		</Container>
	)
}
