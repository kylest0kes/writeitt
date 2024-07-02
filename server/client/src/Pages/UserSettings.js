import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserSettings() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/current-user');
        setUserData(res.data);
      } catch (err) {
        console.error('Failed to fetch user data: ', err);
      }
    }

    fetchUserData();
  }, []);

  if (!userData) {
    return <div className="spinner"></div>;
  }
  
  return (
    <div>
      <h1>Settings</h1>
      <p>{userData.username}</p>
      <p>{userData.email}</p>
    </div>
  )
}

export default UserSettings;