import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

import './DisplayNameModal.scss';

function DisplayNameModal({ onClose }) {
    const [displaynameLen, setDisplaynameLen] = useState(0);
    const [displayName, setDisplayname] = useState('');
    const [csrfToken, setCsrfToken] = useState('');

    const { user, setUser } = useUser();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token')
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();
    }, []);

    useEffect(() => {
        if (user && user.displayName) {
            setDisplayname(user.displayName);
            setDisplaynameLen(user.displayName.length)
        }
    }, [user]);

    const onInputChange = (e) => {
        const input = e.target.value.slice(0, 30);
        setDisplaynameLen(input.length);
        setDisplayname(input);
    }

    const onDisplaynameFormSubmit = async (e) => {
        e.preventDefault();

        if (!displayName) return;

        try {
            const res = await axios.put('/api/users/update-displayname', { displayName: displayName }, {
                headers: {
                    'csrf-token': csrfToken,
                    'Authorization': `Bearer ${authToken}`
                }
            });

            setUser(res.data.user);
            setDisplayname(res.data.user.displayName);
            onClose();
        } catch (err) {
            console.error('Error updating display name: ', err);
        }
    }

    return (
        <div id='displayname-wrapper'>
            <form action='#' method='post' onSubmit={onDisplaynameFormSubmit}>
                <h1 className='displayname-heading'>Change Display Name</h1>
                <h3 className='displayname-subheading'>Changing your display name does not change your username</h3>

                <div className='displayname-input-container'>
                    <div className='displayname-input-wrapper'>
                        <input className='displayname-input' value={displayName} maxLength={30} placeholder='display name' onChange={onInputChange}></input>
                        <span className='displayname-input-len'>{displaynameLen} {displaynameLen === 30 && <span className="limit-reached"> (Limit reached)</span>}</span>
                    </div>
                </div>

                <div className='displayname-btns-container'>
                    <button className='displayname-cancel-btn' type='submit' onClick={() => onClose()}>Cancel</button>
                    <button className='displayname-submit-btn' type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default DisplayNameModal;