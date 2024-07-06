import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

import './EmailModal.scss';

function EmailModal({ onClose }) {
    const [emailModalData, setEmailModalData] = useState({ password: '', newEmail: ''});
    const [disableSumbit, setDisableSubmit] = useState(true);

    const [csrfToken, setCsrfToken] = useState('');

    const { user, setUser } = useUser();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token')
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();

        const isFormValid = emailModalData.password.trim() !== '' && emailModalData.newEmail.trim() !== '';
        setDisableSubmit(!isFormValid);
    }, [emailModalData.password, emailModalData.newEmail]);

    const handleSetEmailModalData = (e) => {
        const { name, value } = e.target;
        setEmailModalData({
            ...emailModalData,
            [name]: value
        })
    }

    const handleEmailModalSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put('/api/users/update-email', emailModalData, {
                headers: {
                    'csrf-token': csrfToken,
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setUser(res.data.user);
            onClose();
        } catch (err) {
            console.error('Error updating email: ', err);
        }
    }

    return (
        <div id='email-wrapper'>
            <form action='#' method='post' onSubmit={handleEmailModalSubmit}>
                <h1 className='email-heading'>Change Email</h1>

                <div className='email-input-container'>
                    <div className='email-input-wrapper'>
                        <input className='email-input' type='password' name='password' placeholder='Password *' value={emailModalData.password} onChange={handleSetEmailModalData} required></input>
                        <input className='email-input' type='email' name='newEmail' placeholder='New email *' value={emailModalData.newEmail} onChange={handleSetEmailModalData} required></input>
                    </div>
                </div>

                <div className='email-btns-container'>
                    <button className='email-cancel-btn' type='submit' onClick={() => onClose()}>Cancel</button>
                    <button className='email-submit-btn' type='submit' disabled={disableSumbit}>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default EmailModal;