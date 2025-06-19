import { FriendsList, Loader, Comment, CreatePost, Post } from "../components";
import styles from "../styles/home.module.css";
import { useAuth, usePosts } from "../hooks";
import { useEffect, useState } from "react";

const Home = () => {
	const auth = useAuth();
	const posts = usePosts();

	const fetchPosts = async () => {
		const response = await posts.initialGetPosts();
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	if (posts.loading) {
		return <Loader />;
	}

	return (
		<div className={styles.home}>
			<div className={styles.postsList}>
				<CreatePost />
				{!posts.loading ? (
					posts.data.length > 0 ? (
						posts.data.map((post) => (
							<Post post={post} key={`post-${post._id}`}></Post>
						))
					) : (
						<>No Posts found, Please post your thoughts</>
					)
				) : (
					<Loader />
				)}
			</div>
			{auth.user && <FriendsList />}
		</div>
	);
};

export default Home;
