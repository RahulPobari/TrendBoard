import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createComment, toggleLike } from "../api";
import { usePosts } from "../hooks";
import styles from "../styles/home.module.css";
import Comment from "./Comment";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const [creatingComment, setCreatingComment] = useState(false);
	const posts = usePosts();

	const handleAddComment = async (e) => {
		if (e.key === "Enter") {
			setCreatingComment(true);
			const response = await createComment(comment, post._id);
			if (response.success) {
				setComment("");
				posts.addComment(response.data.comment, post._id);
				console.log("Post : comment: ", response.data.comment);
				toast.success("Comment created successfully!");
			} else {
				toast.error(response.message);
			}
			setCreatingComment(false);
		}
	};

	const handlePostLikeClick = async () => {
		const response = await toggleLike(post._id, "Post");
		if (response.success) {
			if (response.data.data.deleted) {
				toast.success("Like removed successfully");
				posts.removeLike(response.data.data.id, post._id);
			} else {
				posts.addLike(response.data.data.id, post._id);
				toast.success("Like added successfully!");
			}
		} else {
			toast.error(response.message);
		}
	};

	return (
		<div className={styles.postWrapper} key={`post-${post._id}`}>
			<div className={styles.postHeader}>
				<div className={styles.postAvatar}>
					<img
						src="https://cdn-icons-png.flaticon.com/512/1144/1144709.png"
						alt="user-pic"></img>
					<div>
						<Link
							to={`/user/${post.user._id}`}
							state={{ user: post.user }}
							className={styles.postAuthor}>
							{post.email}
						</Link>
						<span className={styles.postTime}>a minute ago</span>
					</div>
				</div>
				<div className={styles.postContent}>{post.content}</div>

				{/* Post like section code */}
				<div className={styles.postActions}>
					<div className={styles.postLike}>
						<button onClick={handlePostLikeClick}>
							<img
								src="https://cdn-icons-png.flaticon.com/512/456/456115.png"
								alt="likes-icon"></img>
						</button>
						<span>{post.likes.length}</span>
					</div>

					{/* Post comment section code */}
					<div className={styles.postCommentsIcon}>
						<img
							src="https://cdn-icons-png.flaticon.com/512/2190/2190552.png"
							alt="comments-icon"></img>
						<span>{post.comments.length}</span>
					</div>
				</div>
				<div className={styles.postCommentBox}>
					<input
						placeholder="Start typing a comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						onKeyDown={handleAddComment}></input>
				</div>

				<div className={styles.postCommentsList}>
					{post.comments &&
						post.comments.map((comment, index) => (
							<Comment key={`id${index}`} comment={comment} />
						))}
				</div>
			</div>
		</div>
	);
};

Post.prototype = {
	posts: PropTypes.object.isRequired,
};

export default Post;
