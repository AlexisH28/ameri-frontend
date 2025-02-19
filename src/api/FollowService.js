import { io } from 'socket.io-client';
import api from './axiosConfig';

const socket = io('http://localhost:8090', {
    withCredentials: true,
    autoConnect: false
});

const FollowService = {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    onFollow: (callback) => socket.on('follow', callback),
    onUnfollow: (callback) => socket.on('unfollow', callback),
    followUser: async (userId) => {
        try {
            await api.post(`/users/${userId}/follow`);
            socket.emit('follow', userId);
        } catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    },
    unfollowUser: async (userId) => {
        try {
            await api.post(`/users/${userId}/unfollow`);
            socket.emit('unfollow', userId);
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    }
};

export default FollowService;
