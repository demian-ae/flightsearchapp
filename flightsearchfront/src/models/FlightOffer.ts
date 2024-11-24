export interface FlightOffer {
	type: string;
	id: string;
	source: string;
	oneWay: boolean;
	itineraries: Itinerary[];
	price: Price;
	validatingAirlineCodes: string[];
	travelerPricings: TravelerPricing[];
}

export interface Itinerary {
	duration: string;
	segments: Segment[];
}

export interface Segment {
	departure: Location;
	arrival: Location;
	carrierCode: string;
	number: string;
	aircraft: Aircraft;
	operating?: Operating | null;
	duration: string;
	id: string;
	numberOfStops: number;
	blacklistedInEU: boolean;
}

export interface Location {
	iataCode: string;
	terminal?: string | null;
	at: string;
}

export interface Aircraft {
	code: string;
}

export interface Operating {
	carrierCode: string;
}

interface Fee {
	amount: string;
	type: string;
}

interface Price {
	currency: string;
	total: string;
	base: string;
	fees: Fee[];
	grandTotal: string;
}

interface TravelerPricing {
	travelerId: string;
	fareOption: string;
	travelerType: string;
	price: TravelerPrice;
	fareDetailsBySegment: FareDetail[];

}

interface TravelerPrice {
	currency: string;
	total: string;
	base: string;
}

interface FareDetail {
	segmentId: string;
	cabin: string;
	fareBasis: string;
	brandedFare: string;
	brandedFareLabel: string;
	includedCheckedBags: null | string;
	amenities: Amenity[];
	class: string;
}

interface Amenity {
	description: string;
	amenityType: string;
	amenityProvider: AmenityProvider;
	chargeable: boolean;
}

interface AmenityProvider {
	name: string;
}



export const flightOfferExample: FlightOffer = {
	type: "flight-offer",
	id: "2",
	source: "GDS",
	oneWay: false,
	itineraries: [
		{
			duration: "PT4H2M",
			segments: [
				{
					departure: {
						iataCode: "MEX",
						terminal: null,
						at: "2024-12-01T20:15:00",
					},
					arrival: {
						iataCode: "LAX",
						terminal: "B",
						at: "2024-12-01T22:17:00",
					},
					carrierCode: "F9",
					number: "6714",
					aircraft: {
						code: "320",
					},
					operating: null,
					duration: "PT4H2M",
					id: "2",
					numberOfStops: 0,
					blacklistedInEU: false,
				},
			],
		},
		{
			duration: "PT20H15M",
			segments: [
				{
					departure: {
						iataCode: "LAX",
						terminal: "1",
						at: "2024-12-06T21:30:00",
					},
					arrival: {
						iataCode: "LAS",
						terminal: "3",
						at: "2024-12-06T22:46:00",
					},
					carrierCode: "F9",
					number: "3292",
					aircraft: {
						code: "32N",
					},
					operating: {
						carrierCode: "F9",
					},
					duration: "PT1H16M",
					id: "13",
					numberOfStops: 0,
					blacklistedInEU: false,
				},
				{
					departure: {
						iataCode: "LAS",
						terminal: "3",
						at: "2024-12-07T14:08:00",
					},
					arrival: {
						iataCode: "MEX",
						terminal: null,
						at: "2024-12-07T19:45:00",
					},
					carrierCode: "F9",
					number: "6741",
					aircraft: {
						code: "320",
					},
					operating: null,
					duration: "PT3H37M",
					id: "14",
					numberOfStops: 0,
					blacklistedInEU: false,
				},
			],
		},
	],
	price: {
		currency: "MXN",
		total: "14224.00",
		base: "6846.00",
		fees: [
			{
				amount: "0.00",
				type: "SUPPLIER"
			},
			{
				amount: "0.00",
				type: "TICKETING"
			}
		],
		grandTotal: "14224.00"
	},
	validatingAirlineCodes: ["VB"],
	travelerPricings: [
		{
			travelerId: "1",
			fareOption: "STANDARD",
			travelerType: "ADULT",
			price: {
				currency: "MXN",
				total: "9920.00",
				base: "5923.00"
			},
			fareDetailsBySegment: [
				{
					segmentId: "5",
					cabin: "ECONOMY",
					fareBasis: "U07PE5P",
					brandedFare: "ECO",
					brandedFareLabel: "STANDARD",
					includedCheckedBags: null,
					amenities: [
						{
							description: "UPTO100LB 45KG BAGGAGE",
							amenityType: "BAGGAGE",
							amenityProvider: {
								name: "BrandedFare"
							},
							chargeable: false
						},
						{
							description: "FIRST CHECKED BAG",
							amenityType: "BAGGAGE",
							amenityProvider: {
								name: "BrandedFare"
							},
							chargeable: false
						},
						// Más objetos de amenidad...
					],
					class: "U"
				},
				// Más objetos de FareDetailsBySegment...
			]
		},
		{
			travelerId: "2",
			fareOption: "STANDARD",
			travelerType: "ADULT",
			price: {
				currency: "MXN",
				total: "9920.00",
				base: "5923.00"
			},
			fareDetailsBySegment: [
				{
					segmentId: "5",
					cabin: "ECONOMY",
					fareBasis: "U07PE5P",
					brandedFare: "ECO",
					brandedFareLabel: "STANDARD",
					includedCheckedBags: null,
					amenities: [
						{
							description: "UPTO100LB 45KG BAGGAGE",
							amenityType: "BAGGAGE",
							amenityProvider: {
								name: "BrandedFare"
							},
							chargeable: false
						},
						{
							description: "FIRST CHECKED BAG",
							amenityType: "BAGGAGE",
							amenityProvider: {
								name: "BrandedFare"
							},
							chargeable: false
						},
						// Más objetos de amenidad...
					],
					class: "U"
				},
				// Más objetos de FareDetailsBySegment...
			]
		}
	]
};