import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './DeleteStoryModal.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

const DeleteStoryModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const [csrfToken, setCsrfToken] = useState('');
    const { user, setUser } = useUser();
    const { authToken } = useAuth();

    const fetchCsrfToken = async () => {
        const { data } = await axios.get('/api/csrf-token');
        setCsrfToken(data.csrfToken);
    };

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await axios.get(`/api/stories/story/${slug}`);
                setStory(res.data);
            } catch (err) {
                setError("Error fetching story");
                console.error(err);
            }
        };

        fetchStory();
        fetchCsrfToken();
    }, [slug]);

    const handleDeleteStory = async () => {
        if (!user || !authToken || !story) {
            setError("You need to be logged in and the creator of the story to delete it.");
            return;
        }

        setLoading(true);

        try {
            await axios.delete(`/api/stories/delete-story/${slug}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'csrf-token': csrfToken
                }
            });

            setUser(prevUser => ({
                ...prevUser,
                following: prevUser.following.filter(storyId => storyId !== story._id)
            }));

            navigate('/allstories');

        } catch (err) {
            setError(err.response?.data?.message || "Error encountered while trying to delete the story.");
            console.error("Unable to delete Story:", err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <p style={{color: 'red'}}>{error}</p>
    }

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div className='delete-story-modal-wrapper'>
            <h1 className='delete-story-heading'>Are You Sure?</h1>

            <p className='delete-story-subheading'>
                This action cannot be undone. All data associated with this Story will be deleted if you proceed.
            </p>

            <div className='delete-story-btns-container'>
                <button className='delete-story-cancel-btn' type='button' onClick={() => onClose()}>
                    Cancel
                </button>
                <button className='delete-story-submit-btn' type='button' onClick={handleDeleteStory}>
                    {loading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    )
}

export default DeleteStoryModal;
