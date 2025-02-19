import { io } from 'socket.io-client';
import api from './axiosConfig';

const socket = io('http://localhost:8090', {
    withCredentials: true,
    autoConnect: false
});

const ProfileService = {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    onProfileUpdate: (callback) => socket.on('profileUpdate', callback),
    getProfile: async (username) => {
        try {
            const response = await api.get(`/users/${username}`);
            return response.data;
        } catch (error) {
            console.error('Error getting profile:', error);
            throw error;
        }
    },
    updateProfile: async (username, updatedProfile) => {
        try {
            await api.put(`/users/${username}`, updatedProfile);
            socket.emit('profileUpdate', updatedProfile);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
};

export default ProfileService;
