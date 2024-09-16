import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

import './DeleteProfileModal.scss';

function DeleteProfileModal({ onClose }) {
    const [deleteModalData, setDeleteModalData] = useState(
        {
            password: '',
            confirmPassword: ''
        }
    );
    const [disableSubmit, setDisableSubmit] = useState(true);

    const [csrfToken, setCsrfToken] = useState('');

    const { setUser } = useUser();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchCsrfToken = async () => {
           const { data } = await axios.get('/api/csrf-token');
           setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();

        const isFormValid = deleteModalData.password.trim() !== '' && deleteModalData.confirmPassword.trim() !== '';
        setDisableSubmit(!isFormValid);

    }, [deleteModalData.password, deleteModalData.confirmPassword]);

    const handleSetDeleteModalData = (e) => {
        const { name, value } = e.target;
        setDeleteModalData({
            ...deleteModalData,
            [name]: value
        });
    };

    const handleDeleteModalSubmit = async (e) => {
        e.preventDefault();

        // check that the passwords match
        if (deleteModalData.password !== deleteModalData.confirmPassword) {
            console.error('Passwords do not match.');
            return;
        }

        try {
            const res = await axios.put('/api/users/delete-account', deleteModalData, {
                headers: {
                    'csrf-token': csrfToken,
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(res.data.message);
            setUser(null);
            window.location.href = '/';
        } catch (err) {
            console.error("Error deleting account: ", err);
        }
    };

    return (
         <div id='delete-wrapper'>
            <form action='#' method='post' onSubmit={handleDeleteModalSubmit}>
                <h1 className='delete-heading'>Delete Account</h1>

                <p className='delete-subheading'>
                    Once you delete your account, your profile and username will be removed, along with all of your comments.
                </p>

                <div className='delete-input-container'>
                    <div className='delete-input-wrapper'>
                        <input className='delete-input' type='password' name='password' placeholder='Password *' value={deleteModalData.password} onChange={handleSetDeleteModalData} required></input>

                        <input className='delete-input' type='password' name='confirmPassword' placeholder='Confirm Password *' value={deleteModalData.confirmPassword} onChange={handleSetDeleteModalData} required></input>
                    </div>
                </div>

                <div className='delete-btns-container'>
                    <button className='delete-cancel-btn' type='submit' onClick={() => onClose()}>Cancel</button>
                    <button className='delete-submit-btn' type='submit' disabled={disableSubmit}>Submit</button>
                </div>
            </form>
        </div>

    )
}

export default DeleteProfileModal;
