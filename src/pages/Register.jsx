import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Register = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8020/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName, lastName, college, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful', data);
        login();
        // Redirect to login page or display success message
      } else {
        console.error('Registration failed', data.message);
        // Display error message to the user
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch('http://localhost:8020/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful', data);

        // Store the JWT token in local storage
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } else {
        console.error('Login failed', data.message);
        // Display error message to the user
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="leading-normal tracking-normal text-gray-900" style={{
      fontFamily: "'Source Sans Pro', sans-serif",
      backgroundImage: "url('bg.svg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white shadow-2xl rounded-3xl flex" style={{
          maxWidth: '800px',
          width: '100%',
          margin: 'auto',
          transform: 'translateY(3%)',
          maxHeight: '90vh' 
        }}>
          <div className="bg-indigo-800 text-white w-1/2 py-8 px-4 rounded-l-3xl">
            <div className="flex flex-col justify-center h-full">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight text-center">Welcome!</h1>
              <p className="text-md md:text-lg font-light text-center">Get started with us today!</p>
            </div>
          </div>
  
          <div className="bg-white w-full md:w-1/2 rounded-r-3xl" style={{ padding: '1em 4rem' }}>
  <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold text-gray-700 text-center mb-1">Register</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
 
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="college">
                  College/University
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  id="college"
                  type="text"
                  placeholder="College/University"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center justify-center">
                <button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Register;
