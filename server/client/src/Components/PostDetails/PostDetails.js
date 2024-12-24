import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';
import axios from 'axios';

function PostDetails() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const { user, setUser } = useUser();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token');
            setCsrfToken(data.csrfToken);
        };

        fetchCsrfToken();
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/posts/post/${slug}`);
                setPost(res.data);

                setIsAuthor(user && res.data.author && res.data.author._id === user._id);
            } catch (err) { 
                setError('Error fetching Post from Post Details.');
                console.error("Error fetching Post in Post Details: ", err);
            }
        }
        fetchPost();

    }, [post, slug, user]);

    if (error) {
        return <p style={{color: 'red'}}>{error}</p>
    }

    if (!post) {
        return <div className="spinner"></div>;
    }

    return (
        <div style={{ marginTop: '20px' }}>{post.title}</div>
    )
}

export default PostDetails;