import { io } from 'socket.io-client';
import api from './axiosConfig';

const socket = io('http://localhost:8090', {
    withCredentials: true,
    autoConnect: false
});

const CommentService = {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    onNewComment: (callback) => socket.on('newComment', callback),
    addComment: async (postId, comment) => {
        try {
            const response = await api.post(`/posts/${postId}/comments`, comment);
            socket.emit('newComment', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al agregar el comentario:', error);
            throw error;
        }
    },
    editComment: async (commentId, updatedComment) => {
        try {
            const response = await api.put(`/comments/${commentId}`, updatedComment);
            return response.data;
        } catch (error) {
            console.error('Error al editar el comentario:', error);
            throw error;
        }
    },
    deleteComment: async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);
            socket.emit('deleteComment', commentId);
        } catch (error) {
            console.error('Error al eliminar el comentario:', error);
            throw error;
        }
    }
};

export default CommentService;
