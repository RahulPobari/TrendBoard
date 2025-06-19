import PropTypes from "prop-types";
import styles from "../styles/home.module.css";
import { useState, useEffect } from "react";
import { fetchCommentById } from "../api";
import { toast } from "react-toastify";

const Comment = ({ comment }) => {
	const [fetchedComment, setFetchedComment] = useState("");

	const fetchComment = async () => {
		const response = await fetchCommentById(comment);
		if (response.success) {
			setFetchedComment(response.data.comment);
		} else {
			toast.error(response.message);
		}
	};

	useEffect(() => {
		fetchComment();
	}, []);

	return (
		<div className={styles.postCommentItem}>
			<div className={styles.postCommentHeader}>
				<span className={styles.postCommentAuthor}>
					{fetchedComment.userName}
				</span>
				<span className={styles.postCommentTime}>a minute ago</span>
				<span className={styles.postCommentLikes}>
					<i className="fa-solid fa-heart" style={{ color: "#FF0000" }}></i> 13
				</span>
			</div>

			<div className={styles.postCommentContent}>{fetchedComment.content}</div>
		</div>
	);
};

Comment.prototype = {
	comment: PropTypes.object.isRequired,
};

export default Comment;
