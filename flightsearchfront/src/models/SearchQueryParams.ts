import { Dayjs } from "dayjs";
import { AmadeusLocation } from "./AmadeusLocation";

export interface SearchQueryParams { 
	origin: AmadeusLocation | null,
	destination: AmadeusLocation | null,
	departureDate: Dayjs | null,
	arrivalDate: Dayjs | null,
	passengers: number, 
	currency: string,
	nonStop: boolean
}