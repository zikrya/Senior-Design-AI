import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Improvements = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');

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
      console.error('Error fetching topics to review:', error);
      setError('Error fetching topics to review. Please try again.');
    });
  }, []);

  const handleRetry = (topic) => {
    // Logic to retry the topic
    console.log('Retry topic:', topic);
  };

  return (
    <div>
      <h2>Topics to Review</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>
            {topic}
            <button onClick={() => handleRetry(topic)}>Retry</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Improvements;
