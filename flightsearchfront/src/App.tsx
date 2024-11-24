
import { FlightOfferCard } from './components/FlightOfferCard';
import logo from './images/logo-portal.png'
import { flightOfferExample } from './models/FlightOffer';

import "./styles/main.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { SearchHome } from './pages/SearchHome';



function App() {

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
					<Route path="/" element={<SearchHome />} />
					<Route path="/about" element={<FlightOfferCard flightOffer={flightOfferExample} />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
