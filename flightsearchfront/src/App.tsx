
import { FlightOfferCard } from './components/FlightOfferCard';
import logo from './images/logo-portal.png'
import { FlightOffer, flightOfferExample } from './models/FlightOffer';

import "./styles/main.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { SearchHome } from './pages/SearchHome';
import { FlightOfferDetails } from './pages/FlightOfferDetails';
import { useState } from 'react';
import { SearchQueryParams } from './models/SearchQueryParams';



function App() {

	const [currFlighOffer, setCurrFlighOffer] = useState<FlightOffer | undefined>(undefined);

	const [searchQueryParams, setSearchQueryParams] = useState<SearchQueryParams>({
		origin: null,
		destination: null,
		departureDate: null,
		arrivalDate: null,
		passengers: 1,
		currency: 'MXN',
		nonStop: false,
	});

	const [flighOfferResults, setFlighOfferResults] = useState<FlightOffer[] | null>([])

	const NotFound: React.FC = () => <h1>Página no encontrada</h1>;

	return (
		<>
			<Router>
				<div className="logo">
					<Link to="/">
						<img src={logo} alt="logo" draggable={false} />
					</Link>
				</div>
				<Routes>
					<Route path="/" element={<SearchHome
						setCurrFlighOffer={setCurrFlighOffer}
						searchQueryParams={searchQueryParams}
						setSearchQueryParams={setSearchQueryParams}
						flighOfferResults={flighOfferResults}
						setFlighOfferResults={setFlighOfferResults}
					/>} />
					<Route path="/details" element={<FlightOfferDetails flightOffer={currFlighOffer} />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
