import { io } from 'socket.io-client';
import api from './axiosConfig';

const socket = io('http://localhost:8090', {
    withCredentials: true,
    autoConnect: false
});

const LikeService = {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    onLike: (callback) => socket.on('like', callback),
    onUnlike: (callback) => socket.on('unlike', callback),
    addLike: async (postId) => {
        try {
            await api.post(`/posts/${postId}/like`);
            socket.emit('like', postId);
        } catch (error) {
            console.error('Error al dar like:', error);
            throw error;
        }
    },
    removeLike: async (postId) => {
        try {
            await api.post(`/posts/${postId}/unlike`);
            socket.emit('unlike', postId);
        } catch (error) {
            console.error('Error al quitar like:', error);
            throw error;
        }
    }
};

export default LikeService;
