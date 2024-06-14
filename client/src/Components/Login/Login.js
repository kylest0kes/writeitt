import React from 'react'
import './Login.scss'

function Login() {
  return (
    <div id="login-wrapper">
      <form action="#" method="post">
        <h1 className="heading">Log In</h1>

        <p>
          <label for="uname">Username or Email:</label>
          <input id="uname" type="text" name="user_name" />
        </p>

        <p>
          <label for="pword">Password:</label>
          <input id="pword" type="password" name="enter_password" />
        </p>

        <input type="submit" value="Submit" id="submit" />
      </form>
    </div>
  )
}

export default Login