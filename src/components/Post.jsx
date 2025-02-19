import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import CommentService from '../api/CommentService';
import LikeService from '../api/LikeService';

function Post({ post, handleShowModal, deletePost }) {
    const { user } = useContext(AuthContext);
    const [likes, setLikes] = useState(post.likes || 0);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');

    useEffect(() => {
        CommentService.connect();
        LikeService.connect();

        const fetchComments = async () => {
            try {
                const response = await api.get(`/posts/${post.id}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Error al obtener los comentarios:', error);
            }
        };
        fetchComments();

        LikeService.onLike((postId) => {
            if (postId === post.id) setLikes(prev => prev + 1);
        });

        LikeService.onUnlike((postId) => {
            if (postId === post.id) setLikes(prev => prev - 1);
        });

        return () => {
            CommentService.disconnect();
            LikeService.disconnect();
        };
    }, [post.id]);

    const handleLike = async () => {
        try {
            if (liked) {
                await LikeService.removeLike(post.id);
                setLiked(false);
            } else {
                await LikeService.addLike(post.id);
                setLiked(true);
            }
        } catch (error) {
            console.error('Error al dar/retirar like:', error);
        }
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (commentText.trim() === '') return;
        try {
            const newComment = await CommentService.addComment(post.id, { text: commentText });
            setComments([...comments, newComment]);
            setCommentText('');
        } catch (error) {
            console.error('Error al agregar el comentario:', error);
        }
    };

    return (
        <div className="card mb-4 shadow-lg border-0" id={`post-${post.id}`}>
            <div className="card-body">
                <h5 className="card-title text-primary">{post.username}</h5>
                <p className="card-text">{post.text}</p>
                {post.imageUrl && (
                    <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="img-fluid rounded mb-3"
                    />
                )}
                <button 
                    className={`btn me-2 ${liked ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={handleLike}
                >
                    <i className="bi bi-heart"></i> {likes} Likes
                </button>
                <form onSubmit={handleCommentSubmit} className="mt-3">
                    <input 
                        type="text" 
                        placeholder="Escribe un comentario..."
                        value={commentText}
                        onChange={handleCommentChange}
                        className="form-control mb-2"
                        maxLength="200"
                    />
                    <button className="btn btn-secondary" type="submit">
                        <i className="bi bi-chat-dots"></i> Comentar
                    </button>
                </form>
                <ul className="mt-3 list-group">
                    {comments.map((comment, index) => (
                        <li key={index} className="list-group-item">
                            <strong>{comment.username}:</strong> {comment.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Post;
