import React, { useState } from 'react';

function Post({ post, handleShowModal, deletePost }) {
    const [likes, setLikes] = useState(post.likes);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    const handleLike = () => {
        if (liked) {
        setLikes(likes - 1);
        setLiked(false);
        } else {
        setLikes(likes + 1);
        setLiked(true);
        }
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
        setComments([...comments, commentText]);
        setCommentText('');
        }
    };

    <Post 
        post={post} 
        handleShowModal={() => handleShowModal(post)}
        deletePost={deletePost} 
    />

    const handleDelete = () => {
        const postElement = document.getElementById(`post-${post.id}`);
        postElement.classList.add('fade-out');
        setTimeout(() => {
            deletePost(post.id);
        }, 500);
    };

    return (
        <div className="card mb-4 shadow-lg border-0">
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
                <i className="bi bi-heart"></i> Like ({likes})
                </button>
                <button 
                    className="btn btn-success me-2" 
                    onClick={handleShowModal}
                >
                <i className="bi bi-pencil-square"></i> Edit
                </button>
                <button 
                    className="btn btn-outline-danger" 
                    onClick={() => deletePost(post.id)}
                >
                <i className="bi bi-trash"></i> Delete
                </button>
                <form onSubmit={handleCommentSubmit} className="mt-3">
                <input 
                    type="text" 
                    placeholder="Escribe un comentario..."
                    value={commentText}
                    onChange={handleCommentChange}
                    className="form-control mb-2"
                />
                <button className="btn btn-secondary" type="submit">
                    <i className="bi bi-chat-dots"></i> Comentar
                </button>
                </form>
                <ul className="mt-3 list-group">
                {comments.map((comment, index) => (
                    <li key={index} className="list-group-item">
                    {comment}
                    </li>
                ))}
                </ul>
            </div>
        </div>
    );
}

export default Post;



