import React, { useState } from "react";
import "./SignUp.scss";

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const handleSetFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault() 
    console.log('data: ', formData)
  };


  return (
    <div id="signup-wrapper">
      <form action="#" method="post" onSubmit={handleFormSubmit}>
        <h1 className="heading">Create Your Account</h1>

        <p>
          <label for="uname">Username:</label>
          <input id="uname" type="text" name="username" onChange={handleSetFormData} value={formData.username} />
        </p>

        <p>
          <label for="mail">Email:</label>
          <input id="mail" type="email" name="email" onChange={handleSetFormData} value={formData.email} />
        </p>

        <p>
          <label for="password">Password:</label>
          <input id="password" type="password" name="password" onChange={handleSetFormData} value={formData.password} />
        </p>

        <p>
          <label for="confirmPassword">Confirm Password:</label>
          <input id="confirmPassword" type="password" name="confirmPassword" onChange={handleSetFormData} value={formData.confirmPassword} />
        </p>

        <button type="submit" id="submit" className="signup-submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default SignUp;
