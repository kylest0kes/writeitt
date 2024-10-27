import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './DeleteStoryModal.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

const DeleteStoryModal = ({ onClose }) => {
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

    const testClick = () => {
        console.log('works');
    }

    // const handleDeleteClick = (e) => {
    //     if (!user || !authToken) {
    //        setError("You can only delete a Story if you are logged in and the creator of the Story.");
    //        return;
    //     }

    //     // setLoading(true);

    //     try {
    //         console.log("delete clicked: ", slug);
    //     } catch (err) {
    //         console.error("Unable to delete Story: ", err);
    //         setError("Unable to delete Story: ", err);
    //     }
    // }

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
                <button className='delete-story-submit-btn' type='button' onClick={testClick}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default DeleteStoryModal;
