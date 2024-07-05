import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

import './DisplayNameModal.scss';

function DisplayNameModal({ onClose }) {
    const [displaynameLen, setDisplaynameLen] = useState(0);
    const [displayname, setDisplayname] = useState('');
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
        }
    }, [user]);

    const onInputChange = (e) => {
        const inputLen = e.target.value;
        setDisplaynameLen(inputLen.length);
    }

    return (
        <div id='displayname-wrapper'>
            <form>
                <h1 className='displayname-heading'>Change Display Name</h1>
                <h3 className='displayname-subheading'>Changing your display name does not change your username</h3>

                <div className='displayname-input-container'>
                    <div className='input-wrapper'>
                        <input className='displayname-input' placeholder={displayname !== '' ? displayname : 'dispaly name'} onChange={onInputChange}></input>
                        <span className='displayname-input-len'>{displaynameLen}</span>
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