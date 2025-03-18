import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";

const Home = () => {
    const loginToken = localStorage.getItem("login_token");
    const isPrivate = localStorage.getItem("is_private") === '1';
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const size = 5;
    
    const [users, setUsers] = useState([]);
    const [followRequests, setFollowRequests] = useState([]);
    
    useEffect(() => {
        if (!loginToken) {
            navigate("/login");
        }
    }, [navigate, loginToken]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await Api.get("/v1/users");
                setUsers(response.data.users);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    const fetchData = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await Api.get(`/v1/posts?page=${page}&size=${size}`);
            setData((prevData) => [...prevData, ...response.data.posts]);
            setPage((prevPage) => prevPage + 1);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const lastPostRef = useRef(null);

    useEffect(() => {
        if (loading) return;

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchData();
                }
            },
            { threshold: 1.0 }
        );

        if (lastPostRef.current) {
            observer.current.observe(lastPostRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [loading]);

    useEffect(() => {
        if (!loginToken || !isPrivate) return;

        const fetchFollowRequests = async () => {
            try {
                const response = await Api.get(`/v1/users/${username}/followers`);
                const requests = response.data.followers.filter(user => user.is_requested);
                setFollowRequests(requests);
            } catch (err) {
                console.error("Error fetching follow requests:", err);
            }
        };

        fetchFollowRequests();
    }, [loginToken, isPrivate, username]);

    const approveRequest = async (requestUsername) => {
        try {
            await Api.put(`/v1/users/${requestUsername}/accept`);
            setFollowRequests(prevRequests => prevRequests.filter(user => user.username !== requestUsername));
        } catch (err) {
            console.error("Error approving follow request:", err);
        }
    };
    


    return (
        <>

            <main className="mt-5">
                <div className="container py-5">
                    <div className="row justify-content-between">
                        <div className="col-md-8">
                            <h5 className="mb-3">News Feed</h5>

                            {data.map((post, index) => (
                                <div key={post.id} className="card mb-4" ref={index === data.length - 1 ? lastPostRef : null}>
                                    <div className="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                        <h6 className="mb-0">{post.user.full_name}</h6>
                                        <small className="text-muted">{new Date(post.created_at).toDateString()}</small>
                                    </div>
                                    <div className="card-body">
                                        <div className="card-images mb-2">
                                            {post.post_attachments.map((image) => (
                                                <img key={image.id} src={`/${image.storage_path}`} alt="Post Image" className="w-100" />
                                            ))}
                                        </div>
                                        <p className="mb-0 text-muted">
                                            <b><a href={`/profile/${post.user.username}`}>{post.user.username}</a></b> {post.caption}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {loading && <p className="text-center mt-3">Loading more posts...</p>}
                        </div>

                        <div className="col-md-4">
                            {isPrivate && followRequests.length > 0 && (
                                <div className="request-follow mb-4">
                                    <h6 className="mb-3">Follow Requests</h6>
                                    <div className="request-follow-list">
                                        {followRequests.map((user) => (
                                            <div className="card mb-2" key={user.id}>
                                                <div className="card-body d-flex align-items-center justify-content-between p-2">
                                                    <a href={`/profile/${user.username}`}>@{user.username}</a>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => approveRequest(user.username)}
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="explore-people">
                                <h6 className="mb-3">Explore People</h6>
                                <div className="explore-people-list">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <div className="card mb-2" key={user.id}>
                                                <div className="card-body p-2">
                                                    <a href={`/profile/${user.username}`}>@{user.username}</a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No suggestions available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


        </>
    );
}

export default Home;