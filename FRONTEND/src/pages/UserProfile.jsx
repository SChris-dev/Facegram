import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../Api";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { username } = useParams();
    const loginToken = localStorage.getItem("login_token");
    const loggedInUsername = localStorage.getItem("username");

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!loginToken) {
                navigate("/login");
                return;
            }

            try {
                const response = await Api.get(`/v1/users/${username}`);
                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Failed to fetch user profile.");
            }
        };

        fetchUserProfile();
    }, [username]);

    const handleFollow = async () => {
        try {
            if (user.following_status === "not-following") {
                await Api.post(`/v1/users/${username}/follow`);
                setUser((prevUser) => ({
                    ...prevUser,
                    following_status: user.is_private ? "requested" : "following",
                    followers_count: user.is_private ? prevUser.followers_count : prevUser.followers_count + 1
                }));
            } else if (user.following_status === "requested") {
                await Api.delete(`/v1/users/${username}/unfollow`); // Cancel follow request
                setUser((prevUser) => ({
                    ...prevUser,
                    following_status: "not-following",
                }));
            } else {
                await Api.delete(`/v1/users/${username}/unfollow`); // Unfollow if already following
                setUser((prevUser) => ({
                    ...prevUser,
                    following_status: "not-following",
                    followers_count: prevUser.followers_count - 1
                }));
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
            setError("Failed to update follow status.");
        }
    };
    
    

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
    
        try {
            await Api.delete(`/v1/posts/${postId}`);
    
            setUser((prevUser) => ({
                ...prevUser,
                posts: prevUser.posts.filter((post) => post.id !== postId),
                posts_count: prevUser.posts_count - 1,
            }));
        } catch (error) {
            console.error("Error deleting post:", error);
            setError("Failed to delete post.");
        }
    };
    

    if (error) return <p className="text-danger">{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <main className="mt-5">
            <div className="container py-5">
                <div className="px-5 py-4 bg-light mb-4 d-flex align-items-center justify-content-between">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <h5 className="mb-0">{user.full_name}</h5>
                            <span>@{user.username}</span>
                        </div>
                        <small className="mb-0 text-muted">{user.bio}</small>
                    </div>
                    <div>
                        {loggedInUsername === username ? (
                            <a href="/create-post" className="btn btn-primary w-100 mb-2">
                                + Create new post
                            </a>
                        ) : (
                            <button className="btn btn-primary w-100 mb-2" onClick={handleFollow}>
                                {user.following_status === "not-following" && "Follow"}
                                {user.following_status === "requested" && "Requested"}
                                {user.following_status === "following" && "Following"}
                            </button>
                        )}
                        <div className="d-flex gap-3">
                            <div><b>{user.posts_count}</b> posts</div>
                            <div><b>{user.followers_count}</b> followers</div>
                            <div><b>{user.following_count}</b> following</div>
                        </div>
                    </div>
                </div>
                {user.is_private && user.following_status !== "following" && !user.is_your_account ? (
                    <p className="text-center text-muted">The account is private</p>
                ) : (
                    <div className="row justify-content-center">
                        {user.posts.length > 0 ? (
                            user.posts.map((post) => (
                                <div className="col-md-4" key={post.id}>
                                    <div className="card mb-4">
                                        <div className="card-body">
                                            {post.attachments.map((attachment) => (
                                                <img
                                                    key={attachment.id}
                                                    src={attachment.full_url.replace(/\\/g, "")}
                                                    alt="Post"
                                                    className="w-100 mb-2"
                                                />
                                            ))}
                                            <p className="mb-0 text-muted">{post.caption}</p>
                                            
                                            {user.is_your_account && (
                                                <button
                                                    className="btn btn-danger mt-2"
                                                    onClick={() => handleDeletePost(post.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">No posts available</p>
                        )}

                    </div>
                )}

            </div>
        </main>
    );
};

export default UserProfile;
