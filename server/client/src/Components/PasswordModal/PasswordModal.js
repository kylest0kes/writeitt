import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

import './PasswordModal.scss';

function PasswordModal({ onClose }) {
    const [passwordModalData, setPasswordModalData] = useState(
        { 
            password: '', 
            newPassword: '',
            confirmPassword: ''
        }
    );
    const [disableSubmit, setDisableSubmit] = useState(true);

    const [csrfToken, setCsrfToken] = useState('');

    const { setUser } = useUser();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token')
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();

        const isFormValid = passwordModalData.password.trim() !== '' && passwordModalData.confirmPassword.trim() !== '' && passwordModalData.newPassword.trim() !== '';
        setDisableSubmit(!isFormValid);
    }, [passwordModalData.password, passwordModalData.confirmPassword, passwordModalData.newPassword]);

    const handleSetPasswordModalData = (e) => {
        const { name, value } = e.target;
        setPasswordModalData({
            ...passwordModalData,
            [name]: value
        });
    }

    const handlePasswordModalSubmit = async (e) => {
        e.preventDefault();

        // check newPassword and confirmPassword match
        if (passwordModalData.newPassword !== passwordModalData.confirmPassword) {
            return
        }

        try {
            const res = await axios.put('api/users/update-password', passwordModalData, {
                headers: {
                    'csrf-token': csrfToken,
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setUser(res.data.user);
            onClose();

        } catch (err) {
            console.error('Error updating password: ', err);
        }

    }

    return (
        <div id='password-wrapper'>
            <form action='#' method='post' onSubmit={handlePasswordModalSubmit}>
                <h1 className='password-heading'>Change Password</h1>

                <div className='password-input-container'>
                    <div className='password-input-wrapper'>
                        <input className='password-input' type='password' name='password' placeholder='Password *' value={passwordModalData.password} onChange={handleSetPasswordModalData} required></input>
                        
                        <input className='password-input' type='password' name='newPassword' placeholder='Enter New Password *' value={passwordModalData.newPassword} onChange={handleSetPasswordModalData} required></input>

                        <input className='password-input' type='password' name='confirmPassword' placeholder='Confirm New Password *' value={passwordModalData.confirmPassword} onChange={handleSetPasswordModalData} required></input>                        
                    </div>
                </div>

                <div className='password-btns-container'>
                    <button className='password-cancel-btn' type='submit' onClick={() => onClose()}>Cancel</button>
                    <button className='password-submit-btn' type='submit' disabled={disableSubmit}>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default PasswordModal;