import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/index.css";
import { App } from "./components";
import { AuthProvider, PostsProvider } from "./providers";
import { Provider } from "react-redux";
// import store from "./redux/store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ToastContainer />
		{/* <Provider store={store}> */}
		<AuthProvider>
			<PostsProvider>
				<App />
			</PostsProvider>
		</AuthProvider>
		{/* </Provider> */}
	</React.StrictMode>
);
