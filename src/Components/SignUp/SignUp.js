import React from "react";
import "./SignUp.scss";

function SignUp() {
  return (
    <div id="wrapper">
      <form action="#" method="post">
        <h1 className="heading">Create Your Account</h1>

        <p>
          <label for="user">User Name:</label>
          <input id="uname" type="text" name="user_name" />
        </p>

        <p>
          <label for="mail">Email:</label>
          <input id="mail" type="text" name="email" />
        </p>

        <p>
          <label for="pword">Password:</label>
          <input id="pword" type="password" name="enter_password" />
        </p>

        <p>
          <label for="rpword">Re-Type Password:</label>
          <input id="rpword" type="password" name="confirm_password" />
        </p>

        <input type="submit" value="Submit" id="submit" />
      </form>
    </div>
  );
}

export default SignUp;
