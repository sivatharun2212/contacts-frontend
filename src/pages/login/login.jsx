import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import styles from "./login.module.css";

const Login = () => {
	const navigate = useNavigate();
	const [cookies, setCookies] = useCookies(["access_token"]);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	const trackAuthentication = () => {
		if (cookies.access_token) {
			navigate("/contacts");
		}
	};
	useEffect(() => {
		trackAuthentication();

		// eslint-disable-next-line
	}, []);

	const URL = "http://localhost:5001/api/users/login";
	const requestData = {
		email,
		password,
		rememberMe,
	};
	const handleLogin = async (e) => {
		e.preventDefault();
		if (email !== "" && password !== "") {
			try {
				const response = await axios.post(URL, requestData, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				console.log("req sent");
				if (response.data) {
					setCookies("access_token", response.data.accessToken);
				}
				navigate("/contacts");
			} catch (error) {
				console.error(error.message);
			}
		} else {
			alert("all fields are mandatory!");
		}
	};
	return (
		<>
			<section className={styles.section}>
				<div className={styles.container}>
					<h1 className={styles.heading}>Login</h1>
					<form className={styles.loginForm}>
						<input
							type="email"
							placeholder="Email"
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							type="password"
							placeholder="Password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div className={styles.rememberContainer}>
							<input
								type="checkbox"
								onChange={() => setRememberMe(!rememberMe)}
							/>
							<span className={styles.rememberText}> Remember me</span>
						</div>

						<button
							className={styles.loginBtn}
							onClick={handleLogin}>
							Login
						</button>
					</form>
					<div className={styles.signupContainer}>
						<p className={styles.createAccountText}>Create New Account.</p>
						<button
							className={styles.signupBtn}
							onClick={() => navigate("/register")}>
							Sign Up
						</button>
					</div>
				</div>
			</section>
		</>
	);
};

export default Login;
