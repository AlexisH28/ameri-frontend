import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function PostModal({ show, handleClose, savePost, currentPost }) {
    const [postText, setPostText] = useState('');
    const [postImageUrl, setPostImageUrl] = useState('');

    useEffect(() => {
        if (currentPost) {
        setPostText(currentPost.text);
        setPostImageUrl(currentPost.imageUrl);
        } else {
        setPostText('');
        setPostImageUrl('');
        }
    }, [currentPost]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
        text: postText,
        imageUrl: postImageUrl
        };
        savePost(newPost);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{currentPost ? 'Edit Post' : 'Create Post'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Post Text</Form.Label>
                <Form.Control 
                as="textarea" 
                rows={3} 
                value={postText} 
                onChange={(e) => setPostText(e.target.value)}
                required 
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Image URL (Optional)</Form.Label>
                <Form.Control 
                type="text" 
                value={postImageUrl} 
                onChange={(e) => setPostImageUrl(e.target.value)} 
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                {currentPost ? 'Update' : 'Create'}
            </Button>
            </Form>
        </Modal.Body>
        </Modal>
    );
}

export default PostModal;
