import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        // Display error message to the user (consider adding state for this)
      }
    } catch (error) {
      console.error('There was an error!', error);
      // Handle errors (e.g., network issues)
    }
  };

  return (
    <div className="leading-normal tracking-normal text-gray-900" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      <div className="min-h-screen flex items-center justify-center bg-right bg-cover" style={{ backgroundImage: "url('bg.svg')" }}>

        {/* Form */}
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div >
          <div 
          className="flex items-center justify-center bg-right bg-cover"
          >
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
          <p style={{padding:"10px"}}>Don't have an account? <a href='/register' style={{textDecoration:"underline"}}>Register</a></p>
        </form>
      </div>
    </div>
  );
};

export default Login;