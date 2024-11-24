import axios, { AxiosResponse, CancelTokenSource } from "axios";

// Define the return type for the function
interface GetAmadeusDataResult {
	out: Promise<AxiosResponse>;
	source: CancelTokenSource;
}

const CancelToken = axios.CancelToken;

export const getLocations = (keywords: string): GetAmadeusDataResult => {
	// Amadeus API require at least 1 character, so with this we can be sure that we can make this request
	const searchQuery = keywords ? keywords : "a";

	// This is extra tool for cancelation request, to avoid overload API 
	const source = CancelToken.source();

	// GET request with all params we need
	const out = axios.get(
		`/airports?keyword=${searchQuery}&subType=AIRPORT,CITY`,
		{
			cancelToken: source.token
		}
	)
	return { out, source }
};

export const getAirport = (keywords: string) => {
	console.log("getting airport: ", keywords)

	const searchQuery = keywords ? keywords : "a";
	const source = CancelToken.source();

	const out = axios
		.get(`/airports?keyword=${searchQuery}&subType=AIRPORT`, { cancelToken: source.token })
		.catch(err => {
			if (axios.isCancel(err)) {
				console.log("Request cancelled", err.message);
			} else {
				console.error("Error fetching airport data", err);
			}
		})
	return { out, source }
};

export const getAirlines = (iataCodes: string) => {
	console.log("getting airlines: ", iataCodes)

	const source = CancelToken.source();
	const out = axios
		.get(`/airlines?airlineCodes=${iataCodes}`, { cancelToken: source.token })
		.catch(err => {
			if(axios.isCancel(err)){
				console.log("Request cancelled", err.message);
			} else {
				console.error("Error fetching airline data", err);
			}
		})
	return { out, source }
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

	const out = axios.get(`/flights?${query}`, { cancelToken: source.token });

	return { out, source };
};

