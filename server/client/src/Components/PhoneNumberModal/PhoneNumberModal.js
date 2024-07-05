import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import './PhoneNumberModal.scss';

function PhoneNumberModal({ onClose }) {
    const [phone, setPhone] = useState('');

    const handlePhoneChange = (value) => {
        setPhone(value);
    }

    return (
        <div id='phonenumber-wrapper'>
            <form>
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