import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory()
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      history.push('/all')
    }
  };

  return (
    <>
      <div className="backgroud-img height-88vh">
        <div className="height-50vh form-format">

          <h1>Log In</h1>
          <form onSubmit={handleSubmit} className="login-signup height-8vh line-5vh ">
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <label>
              Email
            </label>
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="width-50"
              />
            </div>
            <label>
              Password
            </label>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="width-50"
              />
            </div>
            <div className="flx-col">
              <button type="submit" className="width-50 margin-top25px">Log In</button>
              <button type="sibmit" className="width-50 margin-top25px" onClick={() => {
                setEmail('demo@aa.io')
                setPassword('password')
              }}>Log in as Demo User</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginFormPage;
