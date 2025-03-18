import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";

const CreatePost = () => {
    const loginToken = localStorage.getItem("login_token");
    const navigate = useNavigate();
    const [caption, setCaption] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (!loginToken) {
            navigate("/login");
        }
    }, []);

    const handleFileChange = (event) => {
        setAttachments(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!caption.trim() && attachments.length === 0) {
            setError("Caption or at least one image is required.");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        for (let i = 0; i < attachments.length; i++) {
            formData.append("attachments[]", attachments[i]);
        }

        try {
            await Api.post("/v1/posts", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setCaption("");
            setAttachments([]);
            navigate(`/profile/${username}`);
        } catch (err) {
            console.error("Error creating post:", err);
            setError("Failed to create post.");
        }
    };

    return (
        <main className="mt-5">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-header bg-transparent py-3">
                                <h5 className="mb-0">Create new post</h5>
                            </div>
                            <div className="card-body">
                                {error && <p className="text-danger">{error}</p>}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-2">
                                        <label htmlFor="caption">Caption</label>
                                        <textarea
                                            className="form-control"
                                            name="caption"
                                            id="caption"
                                            cols="30"
                                            rows="3"
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="attachments">Image(s)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="attachments"
                                            name="attachments"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Share
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreatePost;
