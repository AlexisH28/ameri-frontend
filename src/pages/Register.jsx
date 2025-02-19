import { useState, useReducer } from 'react';
import { registerUser } from '../api/AuthApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Reducer to handle form state
const formReducer = (state, action) => {
    return { ...state, [action.field]: action.value };
};

function Register() {
    const [formState, dispatch] = useReducer(formReducer, {
        fullName: '',
        username: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        dispatch({ field: e.target.name, value: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formState.fullName || !formState.username || !formState.email || !formState.password) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            await registerUser(formState);
            toast.success('User registered successfully!');
            navigate('/login');  
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
            toast.error('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container text-center mt-5">
            <h1 className="text-danger">Register</h1>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded">
                <input 
                    type="text" 
                    name="fullName"
                    placeholder="Full Name"
                    value={formState.fullName}
                    onChange={handleChange}
                    className="form-control mb-3"
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formState.username}
                    onChange={handleChange}
                    className="form-control mb-3"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formState.email}
                    onChange={handleChange}
                    className="form-control mb-3"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formState.password}
                    onChange={handleChange}
                    className="form-control mb-3"
                />
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;
