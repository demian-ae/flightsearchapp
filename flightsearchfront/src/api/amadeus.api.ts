import axios, { AxiosResponse, CancelTokenSource } from "axios";
import { AmadeusLocation } from "../models/AmadeusLocation";
import { Airline } from "../models/Airline";

// Cache to store AmadeusLocation objects by IATA code
const airportCache: Map<string, AmadeusLocation> = new Map();

// Cache to store Airline objects by IATA code
const airlineCache: Map<string, Airline> = new Map();

// Define the return type for the function
interface GetAmadeusDataResult {
	out: Promise<AxiosResponse>;
	source: CancelTokenSource;
}

const CancelToken = axios.CancelToken;

// Function to get airport data
export const getAirport = async (iataCode: string): Promise<AmadeusLocation | undefined> => {
	console.log("Getting airport:", iataCode);
	console.log(airportCache)

	// Check cache first
	if (airportCache.has(iataCode)) {
		console.log("Cache hit for IATA code:", iataCode);
		return airportCache.get(iataCode);
	}

	// If not in cache, proceed with API call
	const searchQuery = iataCode || "a";
	const source = CancelToken.source();

	try {
		const response: AxiosResponse<AmadeusLocation[]> = await axios.get(`http://localhost:8081/api/v1/airports?keyword=${searchQuery}&subType=AIRPORT`, {
			cancelToken: source.token,
		});

		// Assuming the API returns an array, find the matching airport
		const airport = response.data.find(location => location.iataCode === iataCode);
		if (airport) {
			// Store the result in the cache
			airportCache.set(iataCode, airport);
		}

		return airport;
	} catch (err) {
		if (axios.isCancel(err)) {
			console.log("Request cancelled:", err.message);
		} else {
			console.error("Error fetching airport data:", err);
		}
	}

	return undefined; // Return undefined if the API call fails
};


export const getLocations = (keywords: string): GetAmadeusDataResult => {
	// Amadeus API require at least 1 character, so with this we can be sure that we can make this request
	const searchQuery = keywords ? keywords : "a";

	// This is extra tool for cancelation request, to avoid overload API 
	const source = CancelToken.source();

	// GET request with all params we need
	const out = axios.get(
		`http://localhost:8081/api/v1/airports?keyword=${searchQuery}&subType=AIRPORT,CITY`,
		{
			cancelToken: source.token
		}
	)
	return { out, source }
};

// Function to get airline data
export const getAirlines = async (iataCode: string | null): Promise<Airline | undefined> => {
	if(!iataCode) return undefined;

	console.log("Getting airlines:", iataCode);

	// Check cache first
	if (airlineCache.has(iataCode)) {
		console.log("Cache hit for airline IATA code:", iataCode);
		return airlineCache.get(iataCode);
	}

	// If not in cache, proceed with API call
	const source = CancelToken.source();

	try {
		const response: AxiosResponse<Airline[]> = await axios.get(`http://localhost:8081/api/v1/airlines?airlineCodes=${iataCode}`, {
			cancelToken: source.token,
		});

		// Assuming the API returns an array, find the matching airline
		const airline = response.data.find(item => item.iataCode === iataCode);
		if (airline) {
			// Store the result in the cache
			airlineCache.set(iataCode, airline);
		}

		return airline;
	} catch (err) {
		if (axios.isCancel(err)) {
			console.log("Request cancelled:", err.message);
		} else {
			console.error("Error fetching airline data:", err);
		}
	}

	return undefined; // Return undefined if the API call fails
};

export const getFlightOffers = (
	params: {
		origin: string;
		destination: string;
		departDate: string;
		currencyCode: string;
		adults: number;
		nonStop: boolean;
		returnDate?: string;
	}
): GetAmadeusDataResult => {
	const source = axios.CancelToken.source();

	const query = new URLSearchParams({
		origin: params.origin,
		destination: params.destination,
		departDate: params.departDate,
		currencyCode: params.currencyCode,
		adults: params.adults.toString(),
		nonStop: params.nonStop.toString(),
		...(params.returnDate ? { returnDate: params.returnDate } : {}),
	}).toString();

	const out = axios.get(`http://localhost:8081/api/v1/flights?${query}`, { cancelToken: source.token });

	return { out, source };
};