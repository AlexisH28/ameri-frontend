import { io } from 'socket.io-client';
import api from './axiosConfig';

const socket = io('http://localhost:8090', {
    withCredentials: true,
    autoConnect: false
});

const NotificationService = {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    onNewNotification: (callback) => socket.on('newNotification', callback),
    getNotifications: async () => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            console.error('Error getting notifications:', error);
            throw error;
        }
    },
    markAsRead: async (notificationId) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
};

export default NotificationService;

