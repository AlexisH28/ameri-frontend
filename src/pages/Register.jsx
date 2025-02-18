import { useState } from 'react';
import { registerUser } from '../api/AuthApi';

function Register() {
    const [userData, setUserData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setUserData({
        ...userData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await registerUser(userData);
        setSuccess('User registered successfully!');
        setError('');
        } catch (error) {
        setError(error.message || 'Registration failed.');
        }
    };

    return (
        <div className="container text-center mt-5">
        <h1 className="text-danger">Register</h1>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <form onSubmit={handleSubmit}>
            <input type="text" name="fullName"
                placeholder="Full Name"
                value={userData.fullName}
                onChange={handleChange}
                className="form-control mb-3"
            />
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={userData.username}
                onChange={handleChange}
                className="form-control mb-3"
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
                className="form-control mb-3"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleChange}
                className="form-control mb-3"
            />
            <button className="btn btn-primary" type="submit">Register</button>
        </form>
        </div>
    );
}

export default Register;
