import axios, { AxiosResponse, CancelTokenSource } from "axios";

// Define a type for the parameters accepted by the function
interface AmadeusParams {
	keyword?: string;
}

// Define the return type for the function
interface GetAmadeusDataResult {
	out: Promise<AxiosResponse>;
	source: CancelTokenSource;
}

const CancelToken = axios.CancelToken;

// This function allow you to make GET request to backend with params we need
export const getLocations = (keywords: string): GetAmadeusDataResult => {

	console.log(keywords)

	// Amadeus API require at least 1 character, so with this we can be sure that we can make this request
	const searchQuery = keywords ? keywords : "a";

	// This is extra tool for cancelation request, to avoid overload API 
	const source = CancelToken.source();

	// GET request with all params we need
	const out = axios.get(
		`/airports?keywords=${searchQuery}`,
		{
			cancelToken: source.token
		}
	)

	console.log(`QUERY: /airports?keyword=${searchQuery}`)

	return { out, source }
};
