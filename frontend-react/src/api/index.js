import { useAuth } from "../hooks";
import { API_URLS, getFormBody, JWT_ACCESS_TOKEN } from "../utils";
import Cookies from "js-cookie";

const customFetch = async (url, { body, ...customConfig }) => {
	const jwtAccessToken = window.localStorage.getItem(JWT_ACCESS_TOKEN);

	const headers = {
		"Content-Type": "application/x-www-form-urlencoded",
	};

	if (jwtAccessToken) {
		headers.Authorization = `Bearer ${jwtAccessToken}`;
	}

	const config = {
		...customConfig,
		headers: {
			...headers,
			...(customConfig.headers || {}), // Ensure custom headers are merged safely
		},
		credentials: "include",
	};

	if (body) {
		config.body = getFormBody(body);
	}

	try {
		const response = await fetch(url, config);

		let data = "";
		if (response.ok) {
			data = await response.json();
			return {
				data: data,
				success: true,
			};
		} else {
			// If response is not ok, throw an error
			throw new Error(data.message || response.statusText || "Request failed");
		}
	} catch (error) {
		return {
			message: error.message,
			success: false,
		};
	}
};

export const getPosts = (page = 1, limit = 5) => {
	return customFetch(API_URLS.posts(page, limit), {
		method: "GET",
	});
};

export const login = (email, password) => {
	return customFetch(API_URLS.login(), {
		method: "POST",
		body: { email, password },
	});
};

export const logout = (email, password) => {
	return customFetch(API_URLS.logout(), {
		method: "GET",
	});
};

export const register = (name, email, password, confirmPassword) => {
	return customFetch(API_URLS.signup(), {
		method: "POST",
		body: { name, email, password, confirm_password: confirmPassword },
	});
};

export const getCurrentUser = () => {
	return customFetch(API_URLS.currentUser(), {
		method: "GET",
	});
};

export const editprofile = async (userId, name, password, confirmPassword) => {
	return customFetch(API_URLS.editUser(), {
		method: "POST",
		body: { id: userId, name, password, confirm_password: confirmPassword },
	});
};

export const fetchUserProfile = (userId) => {
	return customFetch(API_URLS.userInfo(userId), {
		method: "GET",
	});
};

export const fetchUserFriends = () => {
	return customFetch(API_URLS.friends(), {
		method: "GET",
	});
};

export const addFriend = (userId) => {
	return customFetch(API_URLS.createFriendship(userId), {
		method: "POST",
	});
};

export const removeFriend = (userId) => {
	return customFetch(API_URLS.removeFriend(userId), {
		method: "POST",
	});
};

export const addPost = (content) => {
	return customFetch(API_URLS.createPost(), {
		method: "POST",
		body: {
			content,
		},
	});
};

export const createComment = (content, postId) => {
	return customFetch(API_URLS.comment(), {
		method: "POST",
		body: {
			post_id: postId,
			content,
		},
	});
};

export const fetchCommentById = (commentId) => {
	return customFetch(API_URLS.fetchCommentById(commentId), {
		method: "GET",
	});
};

export const fetchCommentsByIdsArr = (commentIdsArr) => {
	return customFetch(API_URLS.fetchCommentsByIdsArr(commentIdsArr), {
		method: "POST",
		body: {
			commentIdsArr,
		},
	});
};

export const toggleLike = (itemId, itemType) => {
	return customFetch(API_URLS.toggleLike(itemId, itemType), {
		method: "POST",
	});
};

export const searchUsers = (searchText) => {
	return customFetch(API_URLS.searchUsers(searchText), {
		method: "GET",
	});
};
