import { useState, useContext } from 'react';
import { loginUser } from '../api/AuthApi';
import AuthContext from '../context/AuthContext';

function Login() {
    const { login } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({
        ...credentials,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const data = await loginUser(credentials);
        login(data.token);
        setError('');
        } catch (error) {
        setError(error.message || 'Login failed.');
        }
    };

    return (
        <div className="container text-center mt-5">
        <h1 className="text-danger">Login</h1>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            name="usernameOrEmail"
            placeholder="Username or Email"
            value={credentials.usernameOrEmail}
            onChange={handleChange}
            className="form-control mb-3"
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="form-control mb-3"
            />
            <button className="btn btn-primary" type="submit">Login</button>
        </form>
        </div>
    );
}

export default Login;
