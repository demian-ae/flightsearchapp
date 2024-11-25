import { Box, CircularProgress, Typography } from "@mui/material"
import { FareDetail, Segment, TravelerPricing } from "../models/FlightOffer"
import { format } from "date-fns/format";
import { LayoverInfo } from "../models/LayoverInfo";
import { useEffect, useState } from "react";
import { Airline } from "../models/Airline";
import { getAirlines, getAirport } from "../api/amadeus.api";
import axios from "axios";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface SegmentDetailedViewProps {
    segment: Segment,
    layOverInfo: LayoverInfo | null,
    travelerPricings: TravelerPricing[]
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

interface AirlinesInfo { // can be the code or the full name
    carrier: string,
    operating: string | null
}

const getAirLinesCodes = (firstSegment: Segment): AirlinesInfo => {
    const carrier = firstSegment.carrierCode;
    let operating = null;
    if (firstSegment.operating) {
        operating = firstSegment.operating.carrierCode;
    }
    return { carrier, operating };
}

export const SegmentDetailedView = ({ segment, layOverInfo, travelerPricings }: SegmentDetailedViewProps) => {
    const [loading, setLoading] = useState(false);

    const departureTime = format(new Date(segment.departure.at), 'MMM dd, yyyy hh:mm a');
    const arrivalTime = format(new Date(segment.arrival.at), 'MMM dd, yyyy hh:mm a');

    const [departureAirport, setDepartureAirport] = useState('');
    const [arrivalAirport, setArrivalAirport] = useState('');

    const [carrierAirline, setCarrierAirline] = useState<Airline | undefined>(undefined);
    const [operatingAirline, setOperatingAirline] = useState<Airline | undefined>(undefined);

    const airlinesCodes = getAirLinesCodes(segment);

    const fareDetails = travelerPricings.map((traveler) => {
        return traveler.fareDetailsBySegment.find((fareDetail) => fareDetail.segmentId === segment.id)
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const outDeparture = getAirport(segment.departure.iataCode);
            const outArrival = getAirport(segment.arrival.iataCode);
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
    }, [])

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: 'inline', padding: 2, borderBottom: 1, borderColor: 'grey.300' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            {layOverInfo &&
                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <AccessTimeIcon />
                    <Typography sx={{ pl: 1, alignItems: 'center' }}>
                        {layOverInfo.duration} in {layOverInfo.iataCode}
                    </Typography>
                </Box>
            }
            <Box sx={{ width: '100%', display: 'flex' }}>
                <Box sx={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ marginTop: 1 }} >
                        <strong>Segment ID: {segment.id}</strong>
                    </Typography>
                    <Box sx={{ pl: 3 }}>
                        <Typography >
                            <strong>Departure:</strong> {departureTime} <br />
                            <i><strong>{departureAirport}</strong></i> {segment.departure.terminal ? 'Terminal ' + segment.departure.terminal : ''}
                        </Typography>
                        <Typography variant="caption">
                            Travel time: {formatDuration(segment.duration)}
                        </Typography>
                        <Typography >
                            <strong>Arrival:</strong> {arrivalTime} <br />
                            <i><strong>{arrivalAirport}</strong></i> {segment.arrival.terminal ? 'Terminal ' + segment.arrival.terminal : ''}
                        </Typography>
                    </Box>
                    {/* Carrier Information */}
                    <Typography sx={{ fontStyle: 'italic', marginTop: 1 }}>
                        {carrierAirline?.commonName} {`(${carrierAirline?.iataCode})`} Flight {segment.number} {operatingAirline ? operatingAirline.iataCode !== carrierAirline?.iataCode ? `Operating: ${operatingAirline.commonName} (${operatingAirline.iataCode})` : `` : ``}
                    </Typography>
                </Box>
                <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ marginTop: 1, fontWeight: 'bold' }} >
                        <strong>Travelers fare:</strong>
                    </Typography>
                    {fareDetails.map((fareDetail, index) => {
                        if (fareDetail) {
                            return (
                                <>
                                    <Typography>
                                        {`Trabeler ${index+1}: Cabin: ${fareDetail.cabin}, Class: ${fareDetail.class}`}
                                    </Typography>
                                    <Typography variant="caption">
                                        Amenities: <br />
                                        {fareDetail.amenities.map((amenitie) => (
                                            <Typography variant="caption">
                                                {`* ${amenitie.description}: ${amenitie.chargeable?'':'NOT'} Chargeable`} <br/>
                                            </Typography>
                                        ))}
                                    </Typography>
                                </>
                            )
                        }
                    })}
                </Box>
            </Box>
        </>
    )
}
