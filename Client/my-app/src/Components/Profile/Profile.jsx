import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import './Profile.css';
import edit1 from '../../Pages/HotelPages/icons8-edit-25 (1).png';
import { Link } from 'react-router-dom';
import { Context } from '../../Context/Context';

function Profile() {
    const { userId, token, profile, setProfile } = useContext(Context);

    useEffect(() => {
        if (token) {
            axios.get(`http://localhost:4000/proview/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setProfile(res.data);
            }).catch(err => {
                console.error(err);
            });
        }
    }, [userId, setProfile, token]);

    if (!profile) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile">
            <h2>Welcome, {profile.name}!</h2>
            <div className='profile-item'>
                <div className="profile-details">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                </div>
                <div className="edit-logo">
                    <Link to={`/profileUpdate/${profile._id}`}>
                        <img src={edit1} alt="Edit Profile" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Profile;
