import { useState } from "react";
import { SearchBar } from "../components/SearchBar"
import { FlightOffer } from "../models/FlightOffer";
import { FlighOfferResultsList } from "../components/FlighOfferResultsList";
import { SearchQueryParams } from "../models/SearchQueryParams";

interface SearchHomeParams {
    setCurrFlighOffer: React.Dispatch<React.SetStateAction<FlightOffer | undefined>>,
	searchQueryParams: SearchQueryParams,
	setSearchQueryParams: React.Dispatch<React.SetStateAction<SearchQueryParams>>,
    flighOfferResults: FlightOffer[] | null,
    setFlighOfferResults: React.Dispatch<React.SetStateAction<FlightOffer[] | null>>
}


export const SearchHome = ({setCurrFlighOffer, searchQueryParams, setSearchQueryParams, flighOfferResults, setFlighOfferResults}: SearchHomeParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setError] = useState(false);
    
    return (
        <div>
            <SearchBar 
                setFlighOfferResults={setFlighOfferResults} 
                setError={setError} 
                setIsLoading={setIsLoading} 
                searchQueryParams={searchQueryParams} 
                setSearchQueryParams={setSearchQueryParams}
            />
            <FlighOfferResultsList flighOfferResults={flighOfferResults} isLoading={isLoading} isError={isError} setCurrFlighOffer={setCurrFlighOffer}/>
        </div>
    )
}
