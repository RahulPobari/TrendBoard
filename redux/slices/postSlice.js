// // postSlice.js
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getPosts } from "../../api";

// const initialState = {
// 	posts: [],
// 	loading: true,
// };

// const postSlice = createSlice({
// 	name: "posts",
// 	initialState,
// 	reducers: {
// 		setPosts: (state, action) => {
// 			state.posts = action.payload;
// 			state.loading = false;
// 		},
// 		fetchPostsSuccess: (state, action) => {
// 			state.posts = action.payload;
// 			state.loading = false;
// 		},
// 		// Add more reducers for other post-related actions
// 	},
// });

// // Async thunk for logout
// export const initialGetPosts = createAsyncThunk(
// 	"posts/initialGetPosts",
// 	async (_, { dispatch }) => {
// 		try {
// 			const response = await getPosts();
// 			if (response.success) {
// 				dispatch(setPosts(response.data)); // You should have a setUser action to clear the user data
// 			} else {
// 				console.error("useProvidePosts Fail Error: ", response.message);
// 			}
// 			return { success: true };
// 		} catch (error) {
// 			console.error("useProvidePosts Fail Error: ", response.message);
// 			return {
// 				success: false,
// 				message: "An error occurred during fetching posts.",
// 			};
// 		}
// 	}
// );

// export const { fetchPostsSuccess } = postSlice.actions;
// export default postSlice.reducer;
