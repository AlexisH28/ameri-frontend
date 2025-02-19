import { io } from 'socket.io-client';
import api from './axiosConfig';

const socket = io('http://localhost:8090', {
    withCredentials: true,
    autoConnect: false
});

const SearchService = {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    onSearchResults: (callback) => socket.on('searchResults', callback),
    search: async (query) => {
        try {
            const response = await api.get(`/search?query=${query}`);
            socket.emit('search', query);
            return response.data;
        } catch (error) {
            console.error('Error al buscar:', error);
            throw error;
        }
    }
};

export default SearchService;
