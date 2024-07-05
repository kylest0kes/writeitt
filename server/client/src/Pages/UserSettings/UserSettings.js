import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

import UserSettingsFormItem from '../../Components/UserSettingsFormItem/UserSettingsFormItem';
import Modal from '../../Components/Modal/Modal';
import AvatarModal from '../../Components/AvatarModal/AvatarModal';
import DisplayNameModal from '../../Components/DisplayNameModal/DisplayNameModal';
import EmailModal from '../../Components/EmailModal/EmailModal';
import PasswordModal from '../../Components/PasswordModal/PasswordModal';
import PhoneNumberModal from '../../Components/PhoneNumberModal/PhoneNumberModal';
import GenderModal from '../../Components/GenderModal/GenderModal';

import './UserSettings.scss';

function UserSettings() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPhoneNumberModalOpen, setIsPhoneNumberModalOpen] = useState(false);
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

  const openAvatarModal = () => setIsAvatarModalOpen(true);
  const closeAvatarModal = () => setIsAvatarModalOpen(false);
  
  const openDisplayNameModal = () => setIsDisplayNameModalOpen(true);
  const closeDisplayNameModal = () => setIsDisplayNameModalOpen(false);
  
  const openEmailModal = () => setIsEmailModalOpen(true);
  const closeEmailModal = () => setIsEmailModalOpen(false);
  
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);
  
  const openPhoneNumberModal = () => setIsPhoneNumberModalOpen(true);
  const closePhoneNumberModal = () => setIsPhoneNumberModalOpen(false);
  
  const openGenderModal = () => setIsGenderModalOpen(true);
  const closeGenderModal = () => setIsGenderModalOpen(false);
  
  

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
      <div onClick={openAvatarModal}>
        <UserSettingsFormItem settingsField={'avatar'} />
      </div>
      <Modal isOpen={isAvatarModalOpen} onClose={closeAvatarModal}>
        <AvatarModal onClose={closeAvatarModal} />
      </Modal>

      <div onClick={openDisplayNameModal}>
        <UserSettingsFormItem settingsField={'display name'} />
      </div>
      <Modal isOpen={isDisplayNameModalOpen} onClose={closeDisplayNameModal}>
        <DisplayNameModal onClose={closeDisplayNameModal} />
      </Modal>
      
      <div onClick={openEmailModal}>
        <UserSettingsFormItem settingsField={'email'} />
      </div>
      <Modal isOpen={isEmailModalOpen} onClose={closeEmailModal}>
        <EmailModal onClose={closeEmailModal} />
      </Modal>
      
      <div onClick={openPasswordModal}>
        <UserSettingsFormItem settingsField={'password'} />
      </div>
      <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal}>
        <PasswordModal onClose={closePasswordModal} />
      </Modal>

      <div onClick={openPhoneNumberModal}>
        <UserSettingsFormItem settingsField={'phone number'} />
      </div>
      <Modal isOpen={isPhoneNumberModalOpen} onClose={closePhoneNumberModal}>
        <PhoneNumberModal onClose={closePhoneNumberModal}/>
      </Modal>
      
      <div onClick={openGenderModal}>
        <UserSettingsFormItem settingsField={'gender'} />
      </div>
      <Modal isOpen={isGenderModalOpen} onClose={closeGenderModal}>
        <GenderModal onClose={closeGenderModal}/>
      </Modal>
      
      <h3 className='settings-subtitle'>Advanced</h3>
      <div className='pill-btn user-settings-delete-btn'>Delete Account</div>
    </div>
  )
}

export default UserSettings;