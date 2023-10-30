import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Contacts from "./pages/contacts/contacts";
function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route
						path="/register"
						element={<Register />}></Route>
					<Route
						path="/"
						element={<Login />}></Route>
					<Route
						path="/contacts"
						element={<Contacts />}></Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
