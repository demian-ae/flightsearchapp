
import logo from './images/logo-portal.png'

import "./styles/main.css";
import { SearchRoot } from './pages/SearchRoot';

function App() {
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
