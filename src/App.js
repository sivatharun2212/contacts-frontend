import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Contacts from "./pages/contacts/contacts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<div className="App">
			<Router>
				<ToastContainer
					position="top-center"
					autoClose={3000}
					hideProgressBar={true}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
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
