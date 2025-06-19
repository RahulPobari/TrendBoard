import styles from "../styles/home.module.css";
import { useAuth } from "../hooks";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { fetchUserFriends } from "../api";

const FriendsList = () => {
	const auth = useAuth();
	let { friends = [] } = auth.user;

	return (
		<div className={styles.friendsList}>
			<div className={styles.header}>Friends</div>
			{friends && friends.length === 0 && (
				<div className={styles.noFriends}>No friends found!</div>
			)}
			{friends &&
				friends.map((friend) => (
					<div key={`friend-${friend.id}`}>
						<Link className={styles.friendsItem} to={`/user/${friend.id}`}>
							<div className={styles.friendsImg}>
								<img
									src="https://cdn-icons-png.flaticon.com/512/1144/1144709.png"
									alt=""></img>
							</div>
							<div className={styles.friendsName}>{friend.name}</div>
						</Link>
					</div>
				))}
		</div>
	);
};

export default FriendsList;
