import React, { createContext, useState, useEffect } from 'react';
import NotificationService from '../api/NotificationService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        NotificationService.connect();

        NotificationService.onNotification((newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            NotificationService.disconnect();
        };
    }, []);

    const markAllAsRead = () => {
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
