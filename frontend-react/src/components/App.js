import { Home, Login, Settings, Signup, UserProfile } from "../pages";
import { Loader, Navbar } from "./";
import { useAuth, useProvideAuth } from "../hooks";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";

// import { useDispatch, useSelector } from "react-redux";
// import { setUserFromToken } from "../redux/slices/authSlice";
import { useEffect } from "react";

const Page404 = () => {
	return <h1>Page404</h1>;
};

function App() {
	const auth = useAuth();

	// const {user, loading} = useSelector((state) => state.auth);
	// const dispatch = useDispatch();

	// useEffect(() => {
	// 	// Dispatch the setUserFromTokenAsync action when the component mounts
	// 	// dispatch(setUserFromToken());
	//   }, []);

	if (auth.loading) {
		return <Loader />;
	}

	// if(loading){
	// 	console.log("User: ", user," ; loading: ", loading)
	// 	return <Loader />;
	// }

	return (
		<div className="App">
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route
						path="/login"
						element={auth.user ? <Navigate to="/" /> : <Login />}
					/>
					<Route
						path="/register"
						element={auth.user ? <Navigate to="/" /> : <Signup />}
					/>
					<Route element={<PrivateRoutes />}>
						<Route path="/" element={<Home />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/user/:userId" element={<UserProfile />} />
						<Route path="*" element={<Page404 />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
