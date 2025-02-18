import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../api/axiosConfig';
import Post from '../components/Post';
import PostModal from '../components/PostModal';

function Home() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    // Obtener Publicaciones en Tiempo Real desde el Backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
                setFilteredPosts(response.data); 
            } catch (error) {
                console.error('Error al obtener las publicaciones:', error);
                alert('Error al obtener las publicaciones. Por favor, intente nuevamente.');
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
                setPosts(posts.map(post => 
                    post.id === currentPost.id ? { ...post, ...response.data } : post
                ));
                alert('Publicación actualizada con éxito.');
            } else {
                const response = await api.post('/posts', newPost);
                setPosts([response.data, ...posts]);
                alert('Publicación creada con éxito.');
            }
        } catch (error) {
            console.error('Error al guardar la publicación:', error);
            alert('Error al guardar la publicación. Por favor, intente nuevamente.');
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
                    alert('Publicación eliminada con éxito.');
                }, 500);
            } catch (error) {
                console.error('Error al eliminar la publicación:', error);
                alert('Error al eliminar la publicación. Por favor, intente nuevamente.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h1 className="text-danger">Ameri & Duki Fan Zone</h1>
                <p className="lead">Share your passion with other fans 🔥</p>
                <input 
                    type="text" 
                    className="form-control mb-3"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                    className="btn btn-primary" 
                    onClick={() => handleShowModal()}
                >
                    Create Post
                </button>
            </div>
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
