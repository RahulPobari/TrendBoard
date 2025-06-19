import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "../api";
import { useAuth, usePosts } from "../hooks";
import styles from "../styles/navbar.module.css";

// import { useDispatch, useSelector } from "react-redux";
// import { setUserFromToken } from "../redux/slices/authSlice";

const Navbar = () => {
	const [results, setResults] = useState([]);
	const [searchText, setSearchText] = useState("");
	const searchResultsRef = useRef(null);
	const auth = useAuth();
	const postsContext = usePosts();

	// const {user, loading} = useSelector((state) => state.auth);
	// const dispatch = useDispatch();

	useEffect(() => {
		const handleClick = (e) => {
			// Check if the click target is within the search result list
			if (
				searchResultsRef.current &&
				!searchResultsRef.current.contains(e.target)
			) {
				// Click occurred outside the search result list, so set the state to null
				setSearchText("");
			}
		};

		// Add a click event listener to the document
		document.addEventListener("click", handleClick);

		// Remove the event listener when the component unmounts
		return () => {
			document.removeEventListener("click", handleClick);
		};
	});

	useEffect(() => {
		const fetchUser = async () => {
			if (searchText.length > 2) {
				const response = await searchUsers(searchText);
				if (response.success) {
					setResults(response.data);
				} else {
					setResults([]); // Set empty array when no results
				}
			} else {
				setResults([]); // Set empty array when searchText is too short
			}
		};

		fetchUser();
	}, [searchText]);

	const handleLogout = () => {
		auth.logout();
		postsContext.clearPostsOnLogout();
	};

	return (
		<div className={`${styles.nav} navbar`}>
			<div className={styles.leftDiv}>
				<h1 className={styles.logo}>
					<Link to="/">
						{"<"}ShareWibe{"/>"}
					</Link>
				</h1>
			</div>

			<div className={styles.searchContainer}>
				<img
					className={styles.searchIcon}
					src="https://cdn-icons-png.flaticon.com/512/149/149852.png"
					alt=""></img>
				<input
					placeholder="Search users"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}></input>

				{results.length > 0 && (
					<div className={styles.searchResults}>
						<ul ref={searchResultsRef}>
							{results.map((user) => (
								<li
									className={styles.searchResultsRow}
									key={`user-${user._id}`}>
									<Link to={`/user/${user._id}`}>
										<img
											src="https://cdn-icons-png.flaticon.com/512/1144/1144709.png"
											alt=""></img>
										<span>{user.name}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<div className={styles.rightNav}>
				{auth.user && (
				// {user && (
					<div className={styles.user}>
						<Link to="/settings">
							<img
								src="https://cdn-icons-png.flaticon.com/512/1144/1144709.png"
								alt="user-icon"
								className={styles.userDp}></img>
							<div>{auth.user.name}</div>
							{/* <div>{user.name}</div> */}
						</Link>
					</div>
				)}

				<div className={styles.navLinks}>
					<ul>
						{auth.user ? (
						// {user ? (
							<li onClick={handleLogout}>
								<Link to="/login">LogOut</Link>
							</li>
						) : (
							<>
								<li>
									<Link to="/login">LogIn</Link>
								</li>
								<li>
									<Link to="/register">Register</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
