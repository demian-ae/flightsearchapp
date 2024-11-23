
import logo from './images/logo-portal.png'

import "./styles/main.css";
import { SearchRoot } from './pages/SearchRoot';
import { useState } from 'react';



function App() {
	const [loading, setLoading] = useState(false);
	const [flightsOffers, setFlightsOffers] = useState();

	return (
		<>
			<div className="logo">
				<img src={logo} alt="logo" draggable={false} />
			</div>
			<SearchRoot />
		</>
	);
}

export default App;
