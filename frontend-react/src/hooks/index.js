import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext, PostsContext } from "../providers";
import {
	editprofile,
	fetchUserFriends,
	getPosts,
	login as userLogin,
	logout as userLogout,
	register,
	getCurrentUser,
} from "../api";
import {
	JWT_ACCESS_TOKEN,
	getItemFromLocalStorage,
	removeItemFromLocalStorage,
	setItemInLocalStorage,
} from "../utils";
import jwt from "jwt-decode";
import { Navigate } from "react-router-dom";
import { API_URLS } from "../utils";

export const useAuth = () => {
	return useContext(AuthContext);
};

export const useProvideAuth = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setUserFromToken();
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		const response = await userLogin(email, password);

		if (response.success) {
			setItemInLocalStorage(
				JWT_ACCESS_TOKEN,
				response.data.token ? response.data.token : null
			);
			setUserFromToken();
			return {
				success: true,
			};
		} else {
			return {
				success: false,
				message: response.message,
			};
		}
	};

	const setUserFromToken = async () => {
		const jwtAccessToken = getItemFromLocalStorage(JWT_ACCESS_TOKEN);
		if (jwtAccessToken) {
			const toeknExtract = jwt(jwtAccessToken);
			const user = toeknExtract.user;

			const response = await fetchUserFriends();
			let friends = [];
			if (response.success) {
				friends = response.data.friends;
			} else {
				console.log("fetchUserFriends Error: ", response.message);
			}
			setUser({
				...user,
				friends,
			});
		}
	};

	const signup = async (name, email, password, confirmPassword) => {
		const response = await register(name, email, password, confirmPassword);
		if (response.success) {
			return {
				success: true,
			};
		} else {
			return {
				success: false,
				message: response.message,
				response,
			};
		}
	};

	const logout = async () => {
		await userLogout()
			.then(() => {
				setUser(null);
				removeItemFromLocalStorage(JWT_ACCESS_TOKEN);
			})
			.catch((err) => console.log("Logout Error: ", err.message));
	};

	const currentUser = async () => {
		const response = await getCurrentUser();
		if (response.success) {
			setUser(response.data.user);
			return {
				success: true,
			};
		} else {
			return {
				success: false,
				message: response.message,
			};
		}
	};

	const updateUser = async (userId, name, password, confirmPassword) => {
		const response = await editprofile(userId, name, password, confirmPassword);
		if (response.success) {
			setUser(response.data.user);
			setItemInLocalStorage(
				JWT_ACCESS_TOKEN,
				response.data.token ? response.data.token : null
			);
			return {
				success: true,
			};
		} else {
			return {
				success: false,
				message: response.message,
			};
		}
	};

	const addUserFriend = (newFriend) => {
		setUser({
			...user,
			friends: [...user.friends, newFriend],
		});
		return;
	};

	const removeUserFriend = (userId) => {
		const newFriends = user.friends.filter((friend) => friend.id !== userId);
		setUser({
			...user,
			friends: newFriends,
		});
		return;
	};

	// const updateUserFriends = (addFriend, newFriend) => {
	// 	if (addFriend) {
	// 		setUser({
	// 			...user,
	// 			friends: [...user.friends, newFriend],
	// 		});
	// 		return;
	// 	}
	// 	const newFriends = user.friends.filter(
	// 		(f) => f.to_user !== newFriend
	// 	);
	// 	setUser({
	// 		...user,
	// 		friends: newFriends,
	// 	});
	// 	return;
	// };

	return {
		user,
		login,
		setUserFromToken,
		signup,
		logout,
		currentUser,
		updateUser,
		loading,
		addUserFriend,
		removeUserFriend,
		// updateUserFriends,
	};
};

export const usePosts = () => {
	return useContext(PostsContext);
};

export const useProvidePosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	const initialGetPosts = async () => {
		const response = await getPosts();
		if (response.success) {
			setPosts(response.data);
			setLoading(false);
		} else {
			console.error("useProvidePosts Fail Error: ", response.message);
		}
	};

	const clearPostsOnLogout = () => {
		setPosts([]);
		setLoading(true);
	};

	const addPostToState = (post) => {
		const newPosts = [post, ...posts];
		setPosts(newPosts);
	};

	const addComment = (comment, postId) => {
		const newPosts = posts.map((post) => {
			if (post._id === postId) {
				return { ...post, comments: [...post.comments, comment] };
			}
			return post;
		});
		setPosts(newPosts);
	};

	const addLike = (like, postId) => {
		const newPosts = posts.map((post) => {
			if (post._id === postId) {
				return { ...post, likes: [...post.likes, like] };
			}
			return post;
		});
		setPosts(newPosts);
	};

	const removeLike = (like, postId) => {
		const newPosts = posts.map((post) => {
			if (post._id === postId) {
				const newLikes = post.likes.filter((likeId) => likeId !== like);
				return { ...post, likes: [...newLikes] };
			}
			return post;
		});
		setPosts(newPosts);
	};

	return {
		data: posts,
		loading,
		initialGetPosts,
		clearPostsOnLogout,
		addPostToState,
		addComment,
		addLike,
		removeLike,
	};
};
