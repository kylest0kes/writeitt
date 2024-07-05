import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

import './GenderModal.scss';

function GenderModal({ onClose }) {
    const [chosenGender, setChosenGender] = useState(' ');
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
        if (user && user.gender) {
            setChosenGender(user.gender);
        }
    }, [user]);

    const handleChoosingGender = (gender) => {
        setChosenGender(gender);
    }

    const handleGenderFormSubmit = async (e) => {
        e.preventDefault();

        if (!chosenGender) return;

        try {
            const res = await axios.put('/api/users/update-gender', { gender: chosenGender}, {
                headers: {
                    'csrf-token': csrfToken,
                    'Authorization': `Bearer ${authToken}`
                }
            });

            setUser(res.data.user);
            onClose();
        } catch (err) {
            console.error('Error updating gender: ', err);
        }
    }

    return (
        <div id='gender-wrapper'>
            <form action='#' method='post' onSubmit={handleGenderFormSubmit}>
                <h1 className='gender-heading'>Change Gender</h1>
                
                <div className='gender-form' onClick={() => handleChoosingGender('Female')}>
                    <div className={`gender-form-item ${chosenGender === 'Female' ? 'selected' : ''}`}>
                        <div className='gender-form-label'>
                            <div className='gender-form-label-content'>
                                <span className='gender-label-text'>Female</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='gender-form' onClick={() => handleChoosingGender('Male')}>
                <div className={`gender-form-item ${chosenGender === 'Male' ? 'selected' : ''}`}>
                        <div className='gender-form-label'>
                            <div className='gender-form-label-content'>
                                <span className='gender-label-text'>Male</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='gender-form' onClick={() => handleChoosingGender('NonBinary')}>
                    <div className={`gender-form-item ${chosenGender === 'NonBinary' ? 'selected' : ''}`}>
                        <div className='gender-form-label'>
                            <div className='gender-form-label-content'>
                                <span className='gender-label-text'>Non-Binary</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='gender-form' onClick={() => handleChoosingGender('PreferNotSay')}>
                    <div className={`gender-form-item ${chosenGender === 'PreferNotSay' ? 'selected' : ''}`}>
                        <div className='gender-form-label'>
                            <div className='gender-form-label-content'>
                                <span className='gender-label-text'>I prefer not to say</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='gender-btns-container'>
                    <button className='gender-cancel-btn' type='submit' onClick={() => onClose()}>Cancel</button>
                    <button className='gender-submit-btn' type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default GenderModal;