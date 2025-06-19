import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwt from "jwt-decode";

import { JWT_ACCESS_TOKEN, getItemFromLocalStorage, setItemInLocalStorage } from "../../utils";
import { fetchUserFriends, login } from "../../api";


// Async thunk for setting user from token
export const setUserFromToken = createAsyncThunk(
	"auth/setUserFromToken",
	async (_, { rejectWithValue }) => {
		try {
			const jwtAccessToken = getItemFromLocalStorage(JWT_ACCESS_TOKEN);
			console.log("jwtAccessToken: ", jwtAccessToken);
			if (jwtAccessToken) {
				const tokenExtract = jwt(jwtAccessToken);
				let user = tokenExtract.user;
				console.log("user: ", user);
				user.friends = [];

				const response = await fetchUserFriends();
				console.log("response: ", response);
				if (response.success) {
					user.friends = [...response.data.friends];
					console.log("user.friends: ", user.friends);
					return user;
				} else {
					console.error("fetchUserFriends Error: ", response.message);
					return rejectWithValue("Error fetching user friends");
				}
			} else {
				console.log("Hello 2");
				return rejectWithValue("JWT token not found");
			}
		} catch (error) {
			console.error("Error in setUserFromToken: ", error);
			return rejectWithValue("An error occurred");
		}
	}
);


// Async thunk for login
export const loginAsync = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading());
    dispatch(clearError());

    const response = await login(email, password);

    if (response.success) {
      setItemInLocalStorage(
				JWT_ACCESS_TOKEN,
				response.data.token ? response.data.token : null
			);
			dispatch(setUserFromToken());
      return { success: true };
    } else {
      dispatch(setError(response.message));
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error('Error during login:', error);
    dispatch(setError('An error occurred while logging in.'));
    return { success: false, message: 'An error occurred while logging in.' };
  }
};

// Async thunk for logout
export const logoutAsync = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
	try {
	  // Call the userLogout function to log the user out
	  await userLogout();
  
	  // Remove the user data from the state and JWT access token from local storage
	  dispatch(setUser(null)); // You should have a setUser action to clear the user data
	  removeItemFromLocalStorage(JWT_ACCESS_TOKEN);
  
	  return { success: true };
	} catch (error) {
	  console.error('Logout Error:', error);
	  return { success: false, message: 'An error occurred during logout.' };
	}
  });

const initialState = {
	user: null,
	loading: true,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
			state.loading = false;
			state.error = null;
		},
		setLoading: (state) => {
			state.loading = true;
			state.error = null;
		},
		setError: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: {
		[setUserFromToken.pending]: (state) => {
			console.log("In Pending");
			state.loading = true;
		},
		[setUserFromToken.fulfilled]: (state, action) => {
			console.log("In fulfilled");
			state.loading = false;
			state.user = action.payload;
		},
		[setUserFromToken.rejected]: (state) => {
			console.log("In rejected");
			state.loading = false;
		},
	},
});

export const { setUser, setLoading, setError, clearError } = authSlice.actions;


export default authSlice.reducer;