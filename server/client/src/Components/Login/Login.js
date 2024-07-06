 import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Contexts/AuthContext';

import './Login.scss';
import { useUser } from '../../Contexts/UserContext';

function Login({ onClose }) {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: ''});
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const { login } = useAuth();
  const { setUser } = useUser();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token');
      setCsrfToken(data.csrfToken);
    };
    fetchCsrfToken();
  }, [])

  const handleSetFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/users/login', formData, {
        headers: {
          'csrf-token': csrfToken
        }
      });
      login(res.data.token);
      setUser(res.data.user)
      onClose();
    } catch (err) {
      setError('Invlaid credentials');
      console.error(`There was an error: ${err}`)
    }
  };


  return (
    <div id="login-wrapper">
      <form action="#" method="post" onSubmit={handleFormSubmit}>
        <h1 className="heading">Log In</h1>

        <p>
          <label className='login-label' htmlFor="uname">Username or Email:</label>
          <input className='login-input' id="uname" type="text" name="usernameOrEmail" value={formData.usernameOrEmail} onChange={handleSetFormData} required />
        </p>

        <p>
          <label className='login-label' htmlFor="pword">Password:</label>
          <input className='login-input' id="pword" type="password" name="password" value={formData.password} onChange={handleSetFormData} required />
        </p>

        <button className='login-btn' type="submit" id="submit">Submit</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}

export default Login