import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';


function UserSettings() {
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
      setLoading(false)
    }
  }, [authToken]);


  if (loading) {
    return <div className="spinner"></div>;
}

if (!userData) {
    return <div>Error: Unable to fetch user data.</div>;
}
  
  return (
    <div>
      <h1>Settings</h1>
      <p style={{'color': 'white'}}>Username: {userData.username}</p>
      <p style={{'color': 'white'}}>Email: {userData.email}</p>
    </div>
  )
}

export default UserSettings;