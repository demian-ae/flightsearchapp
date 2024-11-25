import { Dayjs } from "dayjs";

export interface SearchQueryParams { 
	origin: string,
	destination: string,
	departureDate: Dayjs | null,
	arrivalDate: Dayjs | null,
	passengers: number, 
	currency: string,
	nonStop: boolean
}