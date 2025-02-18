import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function Profile() {
    const { user } = useContext(AuthContext);

    return (
        <div className="container mt-5">
        <div className="card shadow-lg border-0">
            <div className="card-body text-center">
            <img 
                src="https://via.placeholder.com/150" 
                alt="Profile" 
                className="rounded-circle mb-3"
            />
            <h2 className="card-title text-primary">
                {user ? user.username : 'Guest'}
            </h2>
            <p className="text-muted">Fan of Ameri & Duki</p>
            <button className="btn btn-secondary">Edit Profile</button>
            </div>
        </div>
        </div>
    );
}

export default Profile;
