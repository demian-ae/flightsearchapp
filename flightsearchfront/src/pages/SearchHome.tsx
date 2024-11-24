import { useState } from "react";
import { SearchBar } from "../components/SearchBar"
import { FlightOffer } from "../models/FlightOffer";
import { FlighOfferResultsList } from "../components/FlighOfferResultsList";


export const SearchHome = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [flighOfferResults, setFlighOfferResults] = useState<FlightOffer[] | null>([])
    
    return (
        <div>
            <SearchBar setFlighOfferResults={setFlighOfferResults} setError={setError} setIsLoading={setIsLoading}/>
            <FlighOfferResultsList flighOfferResults={flighOfferResults} isLoading={isLoading} isError={isError}/>
        </div>
    )
}
