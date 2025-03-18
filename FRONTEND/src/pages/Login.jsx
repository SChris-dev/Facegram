import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";

const Login = () => {
    const loginToken = localStorage.getItem('login_token');
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
       username: '',
       password: '' 
    });

    function handleChange(e) {
        setLoginData({ ...loginData, [e.target.name]: e.target.value});
    }

    async function handleSubmit (e) {
        e.preventDefault();
        try {
            const response = await Api.post('/v1/auth/login', loginData);
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
                                <h5 class="mb-0">Login</h5>
                            </div>
                            <div class="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div class="mb-2">
                                        <label for="username">Username</label>
                                        <input type="text" class="form-control" id="username" name="username"
                                        value={loginData.username}
                                        onChange={handleChange}/>
                                    </div>

                                    <div class="mb-3">
                                        <label for="password">Password</label>
                                        <input type="password" class="form-control" id="password" name="password"
                                        value={loginData.password}
                                        onChange={handleChange}/>
                                    </div>

                                    <button type="submit" class="btn btn-primary w-100">
                                        Login
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="text-center mt-4">
                            Don't have account? <a href="register">Register</a>
                        </div>

                    </div>
                </div>
            </div>
        </main>
        </>
    )
}

export default Login;