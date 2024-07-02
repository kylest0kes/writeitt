import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

import './UserSettings.scss';
import UserSettingsFormItem from '../../Components/UserSettingsFormItem/UserSettingsFormItem';


function UserSettings() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/users/current-user', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        console.log('res!', res.data)
        setUserData(res.data);
      } catch (err) {
        console.error('Failed to fetch user data: ', err);
      } finally {
        setLoading(false);
      }
    }

    if (authToken) {
      fetchUserData();
    } else {
      navigate('/');
      setLoading(false)
    }
  }, [authToken, navigate]);


  if (loading) {
    return <div className="spinner"></div>;
}

if (!userData) {
    return <div>Error: Unable to fetch user data.</div>;
}
  
  return (
    <div className='user-settings-page'>
      <h1 className='settings-title'>Settings</h1>
      <h3 className='settings-subtitle'>General</h3>
      <UserSettingsFormItem settingsField={'avatar'} />
      <UserSettingsFormItem settingsField={'username'} />
      <UserSettingsFormItem settingsField={'email'} />
      <UserSettingsFormItem settingsField={'phone number'} />
      <UserSettingsFormItem settingsField={'password'} />
      <UserSettingsFormItem settingsField={'gender'} />
      <h3 className='settings-subtitle'>Advanced</h3>
      <div className='pill-btn user-settings-delete-btn'>Delete Account</div>
    </div>
  )
}

export default UserSettings;