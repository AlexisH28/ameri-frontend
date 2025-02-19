import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../api/axiosConfig';
import Post from '../components/Post';
import PostModal from '../components/PostModal';
import PostSortService from '../api/PostSortService';
import { toast } from 'react-toastify';

function Home() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get real-time posts from the Backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
                setFilteredPosts(response.data);
            } catch (err) {
                setError('Error al obtener las publicaciones. Inténtalo nuevamente.');
                toast.error('Error al obtener las publicaciones.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const filtered = posts.filter(post => 
            post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(filtered);
    }, [searchQuery, posts]);

    const handleShowModal = (post = null) => {
        setCurrentPost(post);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setCurrentPost(null);
        setShowModal(false);
    };

    const savePost = async (newPost) => {
        try {
            if (currentPost) {
                const response = await api.put(`/posts/${currentPost.id}`, newPost);
                setPosts(posts.map(post => post.id === currentPost.id ? { ...post, ...response.data } : post));
                toast.success('Publicación actualizada con éxito.');
            } else {
                const response = await api.post('/posts', newPost);
                setPosts([response.data, ...posts]);
                toast.success('Publicación creada con éxito.');
            }
        } catch (err) {
            toast.error('Error al guardar la publicación. Inténtalo nuevamente.');
        }
        handleCloseModal();
    };

    const deletePost = async (postId) => {
        const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta publicación?');
        if (confirmed) {
            try {
                const postElement = document.getElementById(`post-${postId}`);
                postElement.classList.add('fade-out');
                setTimeout(async () => {
                    await api.delete(`/posts/${postId}`);
                    setPosts(posts.filter(post => post.id !== postId));
                    toast.success('Publicación eliminada con éxito.');
                }, 500);
            } catch (err) {
                toast.error('Error al eliminar la publicación.');
            }
        }
    };

    const handleSort = async (type) => {
        try {
            let sortedPosts;
            if (type === 'asc') sortedPosts = await PostSortService.sortByDateAsc();
            if (type === 'desc') sortedPosts = await PostSortService.sortByDateDesc();
            if (type === 'likes') sortedPosts = await PostSortService.sortByLikes();

            setPosts(sortedPosts);
            setSortOrder(type);
            toast.info(`Ordenado por ${type === 'likes' ? 'Likes' : type === 'asc' ? 'Más Antiguos' : 'Más Recientes'}.`);
        } catch (error) {
            toast.error('Error al ordenar las publicaciones.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h1 className="text-danger">Ameri & Duki Fan Zone</h1>
                <p className="lead">Comparte tu pasión con otros fans 🔥</p>

                <input 
                    type="text" 
                    className="form-control mb-3"
                    placeholder="Buscar publicaciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="btn-group mb-3">
                    <button className={`btn ${sortOrder === 'desc' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleSort('desc')}>
                        Más Recientes
                    </button>
                    <button className={`btn ${sortOrder === 'asc' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleSort('asc')}>
                        Más Antiguos
                    </button>
                    <button className={`btn ${sortOrder === 'likes' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleSort('likes')}>
                        Más Populares
                    </button>
                </div>

                <button className="btn btn-success" onClick={() => handleShowModal()}>
                    Crear Publicación
                </button>
            </div>

            {loading ? (
                <p className="text-center">Cargando publicaciones...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : filteredPosts.length === 0 ? (
                <p className="text-muted text-center">No hay publicaciones disponibles.</p>
            ) : (
                <div className="row">
                    {filteredPosts.map(post => (
                        <div className="col-md-6 mb-4" key={post.id} id={`post-${post.id}`}>
                            <Post 
                                post={post} 
                                handleShowModal={() => handleShowModal(post)}
                                deletePost={() => deletePost(post.id)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <PostModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                savePost={savePost} 
                currentPost={currentPost} 
            />
        </div>
    );
}

export default Home;
