"use client";

import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/login`, {
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
        // Display error message to the user (consider adding state for this)
      }
    } catch (error) {
      console.error('There was an error!', error);
      // Handle errors (e.g., network issues)
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
        <div className="bg-white shadow-2xl rounded-3xl" style={{
          maxWidth: '800px',
          width: '100%',
          margin: 'auto',
          transform: 'translateY(-10%)'
        }}>
          <div className="flex" style={{ maxWidth: '800px', width: '100%', margin: 'auto', transform: 'translateY(0%)' }}>

            <div className="bg-indigo-800 text-white w-full md:w-1/2 p-8 text-center rounded-l-3xl">
            <div className="flex flex-col justify-center h-full">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">Welcome Back! </h1>
            <p className="text-md md:text-lg font-light">Coding Simplified.</p>
            <p className="text-md md:text-lg font-light">Learn, Practice,</p>
            <p className="text-md md:text-lg font-light">Succeed.</p>
          </div>
        </div>

            <div className="bg-white w-full md:w-1/2 p-8 rounded-r-3xl">
            <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Login</h2>

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

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    type="submit"
                  >
                    Login
                  </button>
                </div>

                <p className="text-center mt-4">
                  Don't have an account? <a href='/register' className="text-indigo-600 hover:text-indigo-800 transition duration-300 underline">Register</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;