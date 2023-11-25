import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router'

const Improvements = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view topics to review.');
      return;
    }

    axios.get('http://localhost:8020/topics-to-review', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setTopics(response.data);
    })
    .catch(error => {
      console.error('Error fetching topics to review:', error.response || error);
      setError('Error fetching topics to review. Please try again.');
    });
  }, []);

  const handleRetry = (topic) => {
    navigate('/quiz', { state: { topic } });
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="list-disc pl-5">
          {topics.map((topic, index) => (
            <li key={index} className="mb-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{topic}</span>
                <button
                  onClick={() => handleRetry(topic)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Retry
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Improvements;


