import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
const CreateContact = () => {
	const [cookies] = useCookies(["access_token"]);
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [isContactCreated, setIsContactCreated] = useState(false);
	const handleCreateContact = () => {
		if (name && email && phone) {
			setIsContactCreated(true);
		}
	};
	const URL = "http://localhost:5001/api/contacts";
	const requestData = {
		name,
		email,
		phone,
	};
	const handleSaveContact = async () => {
		try {
			const response = await axios.post(URL, requestData, {
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
					"Content-Type": "application/json",
				},
			});
			navigate("/contacts");
		} catch (err) {
			console.error(err.messgae);
		}
	};
	return (
		<>
			<h1>create a new contact</h1>
			<div>
				<input
					type="text"
					placeholder="Name"
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="email"
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="phone"
					placeholder="Phone Number"
					onChange={(e) => setPhone(e.target.value)}
				/>
				<button onClick={handleCreateContact}>create contact</button>
			</div>
			<div>
				{isContactCreated && (
					<>
						<h3>preview</h3>
						<h2>Name : {name}</h2>
						<h2>Email : {email}</h2>
						<h2>Phone Number : {phone}</h2>
						<button onClick={handleSaveContact}>Save</button>
					</>
				)}
			</div>
		</>
	);
};

export default CreateContact;
