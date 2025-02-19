import api from './axiosConfig';

const PostSortService = {
    sortByDateAsc: async () => {
        try {
            const response = await api.get('/posts?order=asc');
            return response.data;
        } catch (error) {
            console.error('Error al ordenar por fecha ascendente:', error);
            throw error;
        }
    },
    sortByDateDesc: async () => {
        try {
            const response = await api.get('/posts?order=desc');
            return response.data;
        } catch (error) {
            console.error('Error al ordenar por fecha descendente:', error);
            throw error;
        }
    },
    sortByLikes: async () => {
        try {
            const response = await api.get('/posts?sort=likes');
            return response.data;
        } catch (error) {
            console.error('Error al ordenar por likes:', error);
            throw error;
        }
    }
};

export default PostSortService;
