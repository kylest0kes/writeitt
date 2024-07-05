import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

import './PhoneNumberModal.scss';

function PhoneNumberModal({ onClose }) {
    const [phone, setPhone] = useState('');
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
        if (user && user.phoneNumber) {
            setPhone(user.phoneNumber);
        }
    }, [user])
    

    const handlePhoneChange = (value) => {
        setPhone(value);
    }

    const handlePhoneNumberFormSubmit = async (e) => {
        e.preventDefault();

        if (!phone) return;

        try {
            const res = await axios.put('/api/users/update-phone', { phoneNumber: phone }, {
                headers: {
                    'csrf-token': csrfToken,
                    'Authorization': `Bearer ${authToken}`
                }
            });

            setUser(res.data.user);
            console.log('phone: ', res.data.user);
            onClose();
        } catch (err) {
            console.error('Error updating phone number: ', err);
        }

    }

    return (
        <div id='phonenumber-wrapper'>
            <form action='#' method='post' onSubmit={handlePhoneNumberFormSubmit}> 
                <h1 className='phonenumber-heading'>Change Phone Number</h1>

                <div className='phone-input-container'>
                    <PhoneInput
                        country={'us'} 
                        value={phone}
                        onChange={handlePhoneChange}
                        inputProps={{
                            name: 'phone',
                            required: true,
                            autoFocus: true
                        }}
                    />
                </div>
                <div className='phone-btns-container'>
                    <button className='phone-cancel-btn' type='submit' onClick={() => onClose()}>Cancel</button>
                    <button className='phone-submit-btn' type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default PhoneNumberModal;