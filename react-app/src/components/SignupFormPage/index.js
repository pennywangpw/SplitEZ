import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import './SignupForm.css';
import background from "../SplashPage/background.png"


function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [frontendErrors, setFrontendErrors] = useState([])
  const [errors, setErrors] = useState([]);

  // frontend validation
  let frontendValidation = []
  useEffect(() => {
    if (email.length === 0) frontendValidation.push("Email is required")
    if (username.length < 4) frontendValidation.push("Username at least 4 characters")
    if (username.length > 10) frontendValidation.push("Username no more than 10 characters")
    if (password.length === 0) frontendValidation.push("Password is required")
    if (password && password.length < 4) frontendValidation.push("Password at least 4 characters")
    if (password && password.length > 8) frontendValidation.push("Password no more than 8 characters")

    setFrontendErrors(frontendValidation)
  }, [email, username, password])

  if (sessionUser) return <Redirect to="/all" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data)
      }
    } else {
      setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };


  return (
    <>
      <div className="backgroud-img height-88vh">
        <div className="height-50vh form-format">

          <h1>Sign Up</h1>
          <div>

            <form onSubmit={handleSubmit} className="login-signup height-8vh line-5vh">
              <ul>
                {frontendErrors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
              <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
              <label>
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="width-50"
              />
              <label>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="width-50"
              />
              <label>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="width-50"
              />
              <label>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="width-50"
              />
              <button type="submit" className="width-50 margin-top25px button-orange" disabled={frontendErrors.length > 0} >Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}


export default SignupFormPage;
