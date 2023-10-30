import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";
const Register = () => {
	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const trackAuthentication = () => {
		if (cookies.access_token) {
			navigate("/contacts");
		}
	};
	useEffect(() => {
		trackAuthentication();

		// eslint-disable-next-line
	}, []);
	const URL = "http://localhost:5001/api/users/register";
	const requestData = {
		userName,
		email,
		password: confirmPassword,
	};
	const handleSignUP = async (e) => {
		e.preventDefault();
		if (userName !== "" && email !== "" && password !== "" && confirmPassword !== "") {
			if (password === confirmPassword) {
				try {
					const response = await axios.post(URL, requestData, {
						headers: {
							"Content-Type": "application/json",
						},
					});
					console.log("req sent");
					console.log(response);
					navigate("/");
				} catch (error) {
					console.error(error.message);
				}
			} else {
				alert("passwords not matched!");
			}
		} else {
			alert("all fields are mandatory!");
		}
	};
	return (
		<>
			<section className={styles.section}>
				<div className={styles.container}>
					<h1 className={styles.heading}>Sign Up</h1>
					<form
						onSubmit={handleSignUP}
						className={styles.registrationForm}>
						<input
							type="text"
							placeholder="User Name"
							onChange={(e) => setUserName(e.target.value)}
						/>
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
						<input
							type="password"
							placeholder="Confirm Password"
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<button
							className={styles.signUpBtn}
							type="submit"
							onClick={handleSignUP}>
							Sign up
						</button>
					</form>
					<div className={styles.signinContainer}>
						<p className={styles.signinText}>Already Have An Account?</p>
						<button
							className={styles.signinBtn}
							onClick={() => navigate("/")}>
							login
						</button>
					</div>
				</div>
			</section>
		</>
	);
};

export default Register;
