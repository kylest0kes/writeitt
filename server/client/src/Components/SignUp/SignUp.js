import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./SignUp.scss";
import { useUser } from "../../Contexts/UserContext";
import { useAuth } from "../../Contexts/AuthContext";

function SignUp({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const { setUser } = useUser();
  const { login } = useAuth();


  // utilizing useEffect to make sure the CSRF token (obtained from the route) is stored in the axios headers every time the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token');
      setCsrfToken(data.csrfToken);
    };
    fetchCsrfToken();
  }, []);

  const handleSetFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault() 
    
    // check matching passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      // complete other logic like adding error classes and all that shit
      return
    }
    setError('');

    // try to sumbit user and throw error and set states if can't
    try {
      // check if username taken or email in use
      const checkValues = await axios.post('/api/users/check', {
        username: formData.username,
        email: formData.email
      }, 
      {
        headers: {
          'csrf-token': csrfToken
        }
      }
    );

      if (checkValues.status !== 200) {
        setError(checkValues.data.message);
        return;
      }

      // continue with sign up if all good
      const res = await axios.post('/api/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, 
      {
        headers: {
          'csrf-token': csrfToken
        }
      }
      );

      if (res.data.token) {
        login(res.data.token);
        setUser ({ username: formData.username, email:formData.email});
        setMessage(`Successfully registered ${formData.username}`);
      } else {
        setError('Registration failed. Please try again.')
      }

      // clear form data
      setFormData({
        username: '',
        email: '', 
        password: '',
        confirmPassword: ''
      });
      onClose();
    } catch (err) {
      console.error(`There was an error: ${err}`);
      if (err.resonse && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setMessage('Error occured during registration. Please try again.')
      }
    }

  };


  return (
    <div id="signup-wrapper">
      <form action="#" method="post" onSubmit={handleFormSubmit}>
        <h1 className="heading">Create Your Account</h1>

        <p>
          <label className="signup-label" htmlFor="uname">Username:</label>
          <input className="signup-input" id="uname" type="text" name="username" onChange={handleSetFormData} value={formData.username} />
        </p>

        <p>
          <label className="signup-label" htmlFor="mail">Email:</label>
          <input className="signup-input" id="mail" type="email" name="email" onChange={handleSetFormData} value={formData.email} />
        </p>

        <p>
          <label className="signup-label" htmlFor="password">Password:</label>
          <input className="signup-input" id="password" type="password" name="password" onChange={handleSetFormData} value={formData.password} />
        </p>

        <p>
          <label className="signup-label" htmlFor="confirmPassword">Confirm Password:</label>
          <input className="signup-input" id="confirmPassword" type="password" name="confirmPassword" onChange={handleSetFormData} value={formData.confirmPassword} />
        </p>

        <button type="submit" id="submit" className="signup-submit-btn">Submit</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'white' }}>{message}</p>}
      </form>
    </div>
  );
}

export default SignUp;
