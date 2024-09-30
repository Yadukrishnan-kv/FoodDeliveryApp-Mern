import React, { useContext, useEffect, useState } from 'react';
import '../Navbar/Navbar.css';

import basket_icon from '../../Assets/basket_icon.png';
import profile from '../../Assets/profile_icon.png';
import propic from './download.png';
import logoutt from '../../Assets/logout_icon.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../../Context/Context';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'; 
import toast from 'react-hot-toast';

function Navbar() {
  const { token, setToken, userId, isAuthorized, User } = useContext(Context);
  const [show, setshow] = useState(false);
  const Navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("user role", User && User.role);
    console.log(User);
  }, [isAuthorized, User]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success('Logged out successfully!')
    Navigate("/login");
  };

  const toggleMenu = () => {
    setshow(!show);
  };
const closeMenu =()=>{
  setshow(false);
}
  return (
    <div className='navbar'>
   
      <div className='hamburger' onClick={toggleMenu}>
        {show ? <FaTimes /> : <FaBars />} 
      </div>
      <ul className={`nav-menu ${show ? 'nav-menu-active' : ''}`}>
        <Link to='/home' style={{ textDecoration: "none", color: "#49557e" }} onClick={closeMenu}>
          <li className={location.pathname === '/home' ? 'active' : ""}> Home</li>
        </Link> 
        <Link to='/menu' style={{ textDecoration: "none", color: "#49557e" }} onClick={closeMenu}>
          <li className={location.pathname === '/menu' ? 'active' : ""}>Menu</li>
        </Link>
        <Link to='/myorder' style={{ textDecoration: "none", color: "#49557e" }} onClick={closeMenu}>
          <li className={location.pathname === '/myorder' ? 'active' : ""}>Order</li>
        </Link>
        <Link to={`/cart/${userId}`} onClick={closeMenu}>
         <li> <img src={basket_icon} alt="basket icon"   /></li>
        </Link>
      </ul>
      <div className="navbar-right">
        {!token ? (
          <Link to={'/login'}><button>Login</button></Link>
        ) : (
          <div className='propic'>
           <FaUserCircle  fontSize={"30px"}/>
            <ul className='navbar-dropdown1'>
              <Link to={`/profile/${userId}`} style={{ textDecoration: "none", color: "black" }}>
                <img src={profile} alt="profile icon" style={{ width: "20px"}} />
              </Link>
              <hr />
              <li onClick={logout}><img src={logoutt} alt="logout icon" style={{ width: "27px" }} /></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;