import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";

const Register = () => {
    const loginToken = localStorage.getItem('login_token');
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        full_name: '',
        username: '',
        password: '',
        bio: '',
        is_private: 0,

    })

    function handleChange(e) {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.type === "checkbox" ? (e.target.checked ? 1 : 0) : e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault(e);
        try {
            const response = await Api.post('/v1/auth/register', registerData);
            localStorage.setItem('login_token', response.data.token);
            localStorage.setItem('username', response.data.user.username);
            localStorage.setItem('is_private', response.data.user.is_private);
            navigate('/');
        }
        catch (err) {
            console.error(err.response?.data || err.message);
        }
    }

    useEffect(() => {
        if (loginToken) {
            navigate(`../profile/${username}`);
        }
    }, []);

    return (
        <>
        <main class="mt-5">
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-5">
                        <div class="card">
                            <div class="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                                <h5 class="mb-0">Register</h5>
                            </div>
                            <div class="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div class="mb-2">
                                        <label for="full_name">Full Name</label>
                                        <input type="text" class="form-control" id="full_name" name="full_name"
                                        value={registerData.full_name}
                                        onChange={handleChange}/>
                                    </div>

                                    <div class="mb-2">
                                        <label for="username">Username</label>
                                        <input type="text" class="form-control" id="username" name="username"
                                        value={registerData.username}
                                        onChange={handleChange}/>
                                    </div>

                                    <div class="mb-3">
                                        <label for="password">Password</label>
                                        <input type="password" class="form-control" id="password" name="password"
                                        value={registerData.password}
                                        onChange={handleChange}/>
                                    </div>

                                    <div class="mb-3">
                                        <label for="bio">Bio</label>
                                        <textarea name="bio" id="bio" cols="30" rows="3" class="form-control"
                                        value={registerData.bio}
                                        onChange={handleChange}></textarea>
                                    </div>

                                    <div class="mb-3 d-flex align-items-center gap-2">
                                        <input type="checkbox" id="is_private" name="is_private"
                                        value={registerData.is_private}
                                        onChange={handleChange}/>
                                        <label for="is_private">Private Account</label>
                                    </div>

                                    <button type="submit" class="btn btn-primary w-100">
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="text-center mt-4">
                            Already have an account? <a href="login">Login</a>
                        </div>

                    </div>
                </div>
            </div>
        </main>
        </>
    )
}

export default Register;