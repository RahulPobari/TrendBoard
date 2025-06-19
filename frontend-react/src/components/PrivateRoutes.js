import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks";

// import { useDispatch, useSelector } from "react-redux";
// import { loginSuccess, logoutSuccess } from "../redux/slices/authSlice";

const PrivateRoutes = () => {
	const auth = useAuth();
	const isAuthenticated = auth.user != null;

	// const user = useSelector((state) => state.auth.user);
	// const isAuthenticated = user != null;

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default PrivateRoutes;
