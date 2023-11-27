"use client";

import React, { useState } from 'react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [college, setCollege] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`/api/register`, {
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
                setIsLoading(false);
                // Redirect to login page or display success message
            } else {
                console.error('Registration failed', data.message);
                // Display error message to the user
                setIsLoading(false);
            }
        } catch (error) {
            console.error('There was an error!', error);
            setIsLoading(false);
        }
    };

    const login = async () => {
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
                            <button type="submit" className="flex items-center justify-center px-4 py-2 ml-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none">
                           {isLoading ? (
                           <>
                          <svg aria-hidden="true" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                         <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span>Loading...</span>
                        </>
                        ) : (
                         'Register'
                          )}
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
