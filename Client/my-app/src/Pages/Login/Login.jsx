import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../axios';
import { Context } from '../../Context/Context';
import toast from 'react-hot-toast';

function Login() {
  const { token, setToken, setUserId } = useContext(Context);
  const [login, setlogin] = useState({ email: '', password: '' });

  const updateform = (e) => {
    setlogin({ ...login, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleupdate = () => {
    api.post('/login', login)
      .then((res) => {
        const data = res.data;
        localStorage.setItem('token', data.token);
        const decodedToken = jwtDecode(data.token);
        setToken(data.token);
        setUserId(decodedToken.sub._id);
        toast.success('Loggined Successfully!')
        navigate('/');
      })
      .catch((err) => {
        const errorMessage = err.response?.data || 'Login failed. Please check your credentials.';
        if (errorMessage === 'Your account is blocked. Please contact support.') {
          toast.error('Your account is blocked. Please contact support.');
        } else {
          toast.error(errorMessage);
        }
      });
  };

  useEffect(() => {
    console.log(login);
  }, [login]);

  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    const decodedToken = jwtDecode(storedToken);
    setToken(storedToken);
    setUserId(decodedToken.sub._id);
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-title">
          <h2>Welcome Back!</h2>
          <p>Please enter your details</p>
        </div>
        <form
          onChange={updateform}
          onSubmit={(e) => {
            e.preventDefault();
            handleupdate();
          }}
        >
          <div className="login-input">
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={login.email}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={login.password}
            />
          </div>
          <div className="login-footer">
            <button className="login-button">Sign In</button>
            <p>
              Don't have an account?{' '}
              <Link to="/sign-up" style={{textDecoration:"none"}}>
                <span>Create one here</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

