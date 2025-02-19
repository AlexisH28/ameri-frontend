import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FollowService from '../api/FollowService';
import ProfileService from '../api/ProfileService';

function Profile() {
    const { username } = useParams();
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({
        bio: '',
        profilePicture: ''
    });

    useEffect(() => {
        ProfileService.connect();
        const fetchProfile = async () => {
            try {
                const data = await ProfileService.getProfile(username);
                setProfile(data);
                setUpdatedProfile({
                    bio: data.bio,
                    profilePicture: data.profilePicture
                });
                setIsFollowing(data.followers.includes(user.username));
            } catch (error) {
                console.error('Error getting profile:', error);
            }
        };
        fetchProfile();

        ProfileService.onProfileUpdate((updated) => {
            if (updated.username === username) {
                setProfile(updated);
            }
        });

        return () => {
            ProfileService.disconnect();
        };
    }, [username, user.username]);

    const handleFollow = async () => {
        try {
            await FollowService.followUser(username);
            setIsFollowing(true);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await FollowService.unfollowUser(username);
            setIsFollowing(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await ProfileService.updateProfile(username, updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <div className="card-body text-center">
                    <img 
                        src={profile.profilePicture || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        className="rounded-circle mb-3 shadow"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <h2 className="card-title text-primary">
                        {profile.username || 'Guest'}
                    </h2>
                    <p className="text-muted">{profile.bio || 'Fan of Ameri & Duki'}</p>
                    {user.username === username ? (
                        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    ) : (
                        isFollowing ? (
                            <button className="btn btn-danger" onClick={handleUnfollow}>
                                Unfollow
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleFollow}>
                                Follow
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
