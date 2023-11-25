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
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundImage: "url('/bg.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto p-5 bg-white rounded-2xl shadow-lg">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-3xl font-extrabold text-center text-indigo-500">User Profile</h2>
        </div>
        <div className="space-y-4 mb-6">
          {/* Profile details */}
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">E-mail</span>
            <span className="text-gray-800">{userData.email}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">First Name</span>
            <span className="text-gray-800">{userData.firstName}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">Last Name</span>
            <span className="text-gray-800">{userData.lastName}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-gray-600">College</span>
            <span className="text-gray-800">{userData.college}</span>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
