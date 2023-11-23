import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    college: '',
  });

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8020/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      <p>Email: {userData.email}</p>
      <p>First Name: {userData.firstName}</p>
      <p>Last Name: {userData.lastName}</p>
      <p>College: {userData.college}</p>
    </div>
  );
};

export default Profile;
