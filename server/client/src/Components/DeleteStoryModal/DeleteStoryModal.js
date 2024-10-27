import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './DeleteStoryModal.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

const DeleteStoryModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { slug } = useParams();
    const [csrfToken, setCsrfToken] = useState('');
    const { user } = useUser();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token')
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();
    }, []);

    const handleDeleteClick = async (e) => {
        if (!user || !authToken) {
           setError("You can only delete a Story if you are logged in and the creator of the Story.");
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

            onClose();

            navigate('/allstories');

            window.location.reload();

        } catch (err) {
            console.error("Unable to delete Story:", err);
            setError(err.response?.data?.message || "Unable to delete Story. Please try again.");
        } finally {
            setLoading(false);
        }
    }

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
                <button className='delete-story-submit-btn' type='button' onClick={handleDeleteClick}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default DeleteStoryModal;
