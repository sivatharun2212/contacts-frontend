import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./contacts.module.css";
import closeIcon from "../../icons/close.png";
import menuIcon from "../../icons/menu.png";
const Contacts = () => {
	const [cookies, setCookies] = useCookies(["access_token"]);
	const navigate = useNavigate();

	const [contacts, setContacts] = useState([]);
	const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);
	const [isContactCreated, setIsContactCreated] = useState(false);
	const [isContactUpdated, setIsContactUpdated] = useState(false);
	const [isContactDeleted, setIsContactDeleted] = useState(false);
	const [searchBy, setSearchBy] = useState("name");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newPhone, setNewPhone] = useState("");
	const [filteredContacts, setFilteredContacts] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [openUpdateCard, SetOPenUpdateCard] = useState(null);
	const [openTagsCard, setOPenTagsCard] = useState(null);
	const [tags, setTags] = useState([]);
	const [tag, setTag] = useState("");
	const [width, setWidth] = useState(window.innerWidth);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const handleResize = () => {
		setWidth(window.innerWidth);
		console.log("w", width);
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const filtered = contacts.filter((contact) => {
			if (searchBy !== "tag") {
				return contact[searchBy].toLowerCase().includes(searchQuery.toLowerCase());
			} else if (searchQuery !== "") {
				return contact.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
			}
			return false;
		});
		setFilteredContacts(filtered);
	}, [searchBy, searchQuery, contacts]);
	const handleSignOut = () => {
		setCookies("access_token", "");
		navigate("/");
	};

	const URL = "https://contacts-mern.onrender.com/api/contacts";
	const requestData = {
		name,
		email,
		phone,
	};

	const handleCreateContact = async () => {
		try {
			await axios.post(URL, requestData, {
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
					"Content-Type": "application/json",
				},
			});
			setIsContactCreated(true);
			setIsCreateButtonClicked(!isCreateButtonClicked);
			setName("");
			setEmail("");
			setPhone("");
		} catch (err) {
			console.error(err.messgae);
		}
	};

	const handleUpdateContact = async (id) => {
		const contact = contacts.find((c) => c._id === id);
		try {
			await axios.put(
				`${URL}/${id}`,
				{
					name: newName === "" ? contact.name : newName,
					email: newEmail === "" ? contact.email : newEmail,
					phone: newPhone === "" ? contact.phone : newPhone,
				},
				{
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
						"Content-Type": "application/json",
					},
				}
			);
			SetOPenUpdateCard(null);
			setIsContactUpdated(true);
			setName("");
			setNewEmail("");
			setNewPhone("");
		} catch (err) {
			console.error(err.message);
		}
	};

	const handleCancelUpdate = () => {
		SetOPenUpdateCard(null);
		setIsContactUpdated(true);
		setName("");
		setNewEmail("");
		setNewPhone("");
	};

	const handleCancelTag = () => {
		setOPenTagsCard(null);
		setTags([]);
		setTag("");
	};

	const hsndelDeleteContact = async (id) => {
		try {
			await axios.delete(`${URL}/${id}`, {
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
					"Content-Type": "application/json",
				},
			});
			setIsContactDeleted(true);
		} catch (err) {
			console.error(err.message);
		}
	};

	const getContacts = async () => {
		try {
			const response = await axios.get(URL, {
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
					"Content-Type": "application/json",
				},
			});
			if (response) {
				setContacts(response.data);
			}
		} catch (error) {
			console.error(error.message);
		}
	};

	if (isContactCreated) {
		getContacts();
		setIsContactCreated(false);
	}
	if (isContactUpdated) {
		getContacts();
		setIsContactUpdated(false);
	}
	if (isContactDeleted) {
		getContacts();
		setIsContactDeleted(false);
	}

	const handleSaveTags = async (id) => {
		// const contact = contacts.find((c) => c._id === id);
		try {
			await axios.put(
				`${URL}/${id}`,
				{
					tags,
				},
				{
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
						"Content-Type": "application/json",
					},
				}
			);
			await getContacts();
			setOPenTagsCard(null);
		} catch (err) {
			console.error(err.message);
		}
	};

	const removeTag = (index) => {
		const updatedTags = tags.filter((_, i) => i !== index);
		setTags(updatedTags);
	};
	const getTags = (id) => {
		const contact = contacts.find((c) => c._id === id);
		setTags(contact.tags);
	};
	const handleAddTags = (id) => {
		if (tag !== "") {
			setTags([...tags, tag]);
			setTag("");
		}
	};

	useEffect(() => {
		getContacts();

		// eslint-disable-next-line
	}, []);

	return (
		<>
			<section className={styles.section}>
				<div className={styles.container}>
					<div className={styles.navbarrapper}>
						<div className={styles.navbar}>
							<div
								style={{ width: width < 850 ? "5px" : "" }}
								className={styles.stick}></div>
							<div
								style={{ justifyContent: width < 850 ? "flex-start" : "center", marginLeft: width < 850 ? "20px" : "" }}
								className={styles.titleCont}>
								<h1 className={styles.title}>My Contacts</h1>
							</div>
							<div
								style={{ justifyContent: width < 850 ? "flex-start" : "space-between", width: width < 850 ? "100%" : "" }}
								className={styles.searchCont}>
								<input
									style={{ width: width < 850 ? "calc(97% - 30px)" : "" }}
									type="text"
									placeholder="Find a contacts..."
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								<select
									style={{ width: width < 630 ? "25px" : "", marginLeft: width < 850 ? "10px" : "" }}
									value={searchBy}
									onChange={(e) => setSearchBy(e.target.value)}>
									<option value="name">Search By Name</option>
									<option value="email">Search By Email</option>
									<option value="phone">Search By Phone Number</option>
									<option value="tag">Search By Tag</option>
								</select>
							</div>
							{width > 1060 ? (
								<div className={styles.btnCont}>
									<button
										className={styles.signOutBtn}
										onClick={handleSignOut}>
										sign out
									</button>
									<button
										className={styles.createBtn}
										onClick={() => setIsCreateButtonClicked(!isCreateButtonClicked)}>
										create contact
									</button>
								</div>
							) : (
								<div>
									<img
										style={{ bottom: width < 850 ? "70px" : "25px" }}
										onClick={() => setIsMenuOpen(!isMenuOpen)}
										className={styles.menuIcon}
										src={menuIcon}
										alt="menu"
									/>
								</div>
							)}
							{isMenuOpen && (
								<div className={styles.btnContmenu}>
									<button
										className={styles.signOutBtnmenu}
										onClick={handleSignOut}>
										sign out
									</button>
									<button
										className={styles.createBtnmenu}
										onClick={() => {
											setIsCreateButtonClicked(!isCreateButtonClicked);
											setIsMenuOpen(!isMenuOpen);
										}}>
										create contact
									</button>
								</div>
							)}
						</div>
						{isCreateButtonClicked && (
							<div className={styles.createContactCont}>
								<h1 className={styles.createHeading}>create a new contact</h1>
								<img
									style={{ width: "14px", position: "absolute", right: "20px", top: "20px" }}
									src={closeIcon}
									alt="close section"
									onClick={() => setIsCreateButtonClicked(!isCreateButtonClicked)}
								/>
								<div
									style={{ flexWrap: width < 1020 ? "wrap" : "nowrap" }}
									className={styles.CreateContactsInput}>
									<input
										style={{ marginBottom: width < 1020 ? "20px" : "" }}
										type="text"
										placeholder="Name"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
									<input
										style={{ marginBottom: width < 1020 ? "20px" : "" }}
										type="email"
										placeholder="Email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
									<input
										style={{ marginBottom: width < 1020 ? "20px" : "" }}
										type="phone"
										placeholder="Phone Number"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
									/>
									<button
										className={styles.createContactBtn}
										onClick={handleCreateContact}>
										Save
									</button>
								</div>
							</div>
						)}
					</div>
					<div className={styles.contactsCont}>
						<div className={styles.cardsCont}>
							{filteredContacts.length === 0
								? contacts.map((contact) => {
										return (
											<div
												key={contact._id}
												className={styles.card}>
												{openUpdateCard === contact._id ? (
													<>
														<div className={styles.updateCont}>
															<h1 className={styles.updateHeading}>Update Contact</h1>
															<input
																type="text"
																placeholder="Name"
																value={newName}
																onChange={(e) => setNewName(e.target.value)}
															/>
															<input
																type="email"
																placeholder="Email"
																value={newEmail}
																onChange={(e) => setNewEmail(e.target.value)}
															/>
															<input
																type="phone"
																placeholder="Phone Number"
																value={newPhone}
																onChange={(e) => setNewPhone(e.target.value)}
															/>
															<div className={styles.btnWrapper}>
																<button
																	className={styles.createContactBtn}
																	onClick={handleCancelUpdate}>
																	cancel
																</button>
																<button
																	className={styles.createContactBtn}
																	onClick={() => handleUpdateContact(contact._id)}>
																	Save
																</button>
															</div>
														</div>
													</>
												) : openTagsCard === contact._id ? (
													<>
														<div className={styles.tagsCont}>
															<div className={styles.addTags}>
																<input
																	type="text"
																	placeholder="Ex. Family"
																	value={tag}
																	onChange={(e) => setTag(e.target.value)}
																/>
																<button onClick={handleAddTags}>Add</button>
															</div>

															<div className={styles.tags}>
																<div className={styles.tagsWrapper}>
																	{tags?.length !== 0 ? (
																		tags.map((tag, index) => {
																			return (
																				<div
																					key={index}
																					className={styles.tagTxt}>
																					@{tag}
																					<img
																						style={{ width: "10px", marginLeft: "5px", cursor: "pointer" }}
																						src={closeIcon}
																						alt="close"
																						onClick={() => removeTag(index)}
																					/>
																				</div>
																			);
																		})
																	) : (
																		<h3>no tags</h3>
																	)}
																</div>
															</div>
															<div className={styles.tagBtnCont}>
																<button
																	className={styles.tagCancelBtn}
																	onClick={handleCancelTag}>
																	cancel
																</button>
																<button
																	className={styles.tagSaveBtn}
																	onClick={() => handleSaveTags(contact._id)}>
																	save
																</button>
															</div>
														</div>
													</>
												) : (
													<>
														<div className={styles.infoCont}>
															<div className={styles.infoWrapper}>
																<div className={styles.heading}>
																	<h1 className={styles.key}>Name</h1>
																</div>
																<div className={styles.info}>
																	<h1 className={styles.value}>{contact.name}</h1>
																</div>
															</div>
															<div className={styles.infoWrapper}>
																<div className={styles.heading}>
																	<h1 className={styles.key}>Email</h1>
																</div>
																<div className={styles.info}>
																	<h1 className={styles.value}>{contact.email}</h1>
																</div>
															</div>
															<div className={styles.infoWrapper}>
																<div className={styles.heading}>
																	<h1 className={styles.key}>Phone Number</h1>
																</div>
																<div className={styles.info}>
																	<h1 className={styles.value}>{contact.phone}</h1>
																</div>
															</div>
														</div>
														<div className={styles.cardBtns}>
															<button
																onClick={() => SetOPenUpdateCard(contact._id)}
																className={styles.updateBtn}>
																Update
															</button>
															<button
																className={styles.delBtn}
																onClick={() => hsndelDeleteContact(contact._id)}>
																Delete
															</button>
															<button
																onClick={() => {
																	setOPenTagsCard(contact._id);
																	getTags(contact._id);
																}}
																className={styles.tagBtn}>
																Tags
															</button>
														</div>
													</>
												)}
											</div>
										);
								  })
								: filteredContacts.map((contact) => {
										return (
											<div
												key={contact._id}
												className={styles.card}>
												{openUpdateCard === contact._id ? (
													<>
														<div className={styles.updateCont}>
															<h1 className={styles.updateHeading}>Update Contact</h1>
															<input
																type="text"
																placeholder="Name"
																value={newName}
																onChange={(e) => setNewName(e.target.value)}
															/>
															<input
																type="email"
																placeholder="Email"
																value={newEmail}
																onChange={(e) => setNewEmail(e.target.value)}
															/>
															<input
																type="phone"
																placeholder="Phone Number"
																value={newPhone}
																onChange={(e) => setNewPhone(e.target.value)}
															/>
															<div className={styles.btnWrapper}>
																<button
																	className={styles.UpContactBtn}
																	onClick={handleCancelUpdate}>
																	cancel
																</button>
																<button
																	className={styles.UpContactBtn}
																	onClick={() => handleUpdateContact(contact._id)}>
																	Save
																</button>
															</div>
														</div>
													</>
												) : openTagsCard === contact._id ? (
													<>
														<div className={styles.tagsCont}>
															<div className={styles.addTags}>
																<input
																	type="text"
																	placeholder="Ex. Family"
																	value={tag}
																	onChange={(e) => setTag(e.target.value)}
																/>
																<button onClick={handleAddTags}>Add</button>
															</div>

															<div className={styles.tags}>
																<div className={styles.tagsWrapper}>
																	{tags?.length !== 0 ? (
																		tags.map((tag, index) => {
																			return (
																				<div className={styles.tagTxt}>
																					@{tag}
																					<img
																						style={{ width: "10px", marginLeft: "5px", cursor: "pointer" }}
																						src={closeIcon}
																						alt="close"
																						onClick={() => removeTag(index)}
																					/>
																				</div>
																			);
																		})
																	) : (
																		<h3>no tags</h3>
																	)}
																</div>
															</div>
															<div className={styles.tagBtnCont}>
																<button
																	className={styles.tagCancelBtn}
																	onClick={handleCancelTag}>
																	cancel
																</button>
																<button
																	className={styles.tagSaveBtn}
																	onClick={() => handleSaveTags(contact._id)}>
																	save
																</button>
															</div>
														</div>
													</>
												) : (
													<>
														<div className={styles.infoCont}>
															<div className={styles.infoWrapper}>
																<div className={styles.heading}>
																	<h1 className={styles.key}>Name</h1>
																</div>
																<div className={styles.info}>
																	<h1 className={styles.value}>{contact.name}</h1>
																</div>
															</div>
															<div className={styles.infoWrapper}>
																<div className={styles.heading}>
																	<h1 className={styles.key}>Email</h1>
																</div>
																<div className={styles.info}>
																	<h1 className={styles.value}>{contact.email}</h1>
																</div>
															</div>
															<div className={styles.infoWrapper}>
																<div className={styles.heading}>
																	<h1 className={styles.key}>Phone Number</h1>
																</div>
																<div className={styles.info}>
																	<h1 className={styles.value}>{contact.phone}</h1>
																</div>
															</div>
														</div>
														<div className={styles.cardBtns}>
															<button
																onClick={() => SetOPenUpdateCard(contact._id)}
																className={styles.updateBtn}>
																Update
															</button>
															<button
																className={styles.delBtn}
																onClick={() => hsndelDeleteContact(contact._id)}>
																Delete
															</button>
															<button
																onClick={() => {
																	setOPenTagsCard(contact._id);
																	getTags(contact._id);
																}}
																className={styles.tagBtn}>
																Tags
															</button>
														</div>
													</>
												)}
											</div>
										);
								  })}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Contacts;
