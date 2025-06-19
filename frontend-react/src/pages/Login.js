import { useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/login.module.css";
// import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
// import { loginAsync } from "../redux/slices/authSlice";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loggingIn, setLoggingIn] = useState(false);

	const auth = useAuth();
	const navigate = useNavigate();

	// const loading = useSelector((state) => state.auth.loading);
	// const error = useSelector((state) => state.auth.error);
	// const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoggingIn(true);

		if (!email || !password) {
			return toast.error("Please enter both email and password");
		}
		const response = await auth.login(email, password);

		if (response.success) {
			navigate("/");
			toast.success("Successfully logged in");
		} else {
			console.log("login error: ", response);
			toast.error(response.message);
		}

		// const response = await dispatch(loginAsync(email, password)); // Dispatch the login action

		if (response.success) {
			// Handle successful login (e.g., redirect to dashboard)
			navigate("/");
			toast.success("Successfully logged in");
		} else {
			// Handle login error (e.g., display error message)
			console.log("login error: ", response.message);
			toast.error(response.message);
		}

		setLoggingIn(false);
	};

	return (
		<form className={styles.loginForm} onSubmit={handleSubmit}>
			<span className={styles.loginSignupHeader}>Log In</span>

			<div className={styles.field}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>

			<div className={styles.field}>
				<input
					type="password"
					placeholder="Paasword"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			<div className={styles.field}>
				<button disabled={loggingIn}>
					{loggingIn ? "Logging in ..." : "Log In"}
				</button>
			</div>
		</form>
	);
};

export default Login;
