import React, { useState } from 'react';
import axios from 'axios';

const ChatGpt = () => {
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const HTTP = "http://localhost:8020/chat";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setUserAnswers({});
    setResponses([]);
    setSubmitted(false);

    axios.post(`${HTTP}`, { topic: prompt, difficulty })
      .then((res) => {
        if (res.status >= 400) {
          setError(`Error: ${res.status}. ${res.statusText}`);
        } else {
          try {
            let data = res.data;
            if (!Array.isArray(data) || data.length === 0) {
              throw new Error('Data is not an array or is empty');
            }
            data.forEach((item) => {
              if (!item.question_text || !Array.isArray(item.options)) {
                console.log('Invalid item:', item);
                throw new Error('Each item must have a question_text and an options array');
              }
            });
            setResponses(data);
          } catch (error) {
            console.error('Error processing data:', error);
            setError('Error processing data: ' + error.message);
          }
        }
      })
      .catch((error) => {
        console.error('Request Error:', error.response?.data || error);
        setError(`An error occurred: ${error.response?.data?.message || error.message}`);
      });
  };

  const handlePrompt = (e) => setPrompt(e.target.value);
  const handleDifficultyChange = (e) => setDifficulty(e.target.value);

  const handleOptionClick = (responseIndex, selectedOptionIndex) => {
    setUserAnswers({ ...userAnswers, [responseIndex]: selectedOptionIndex });
  };

  const handleSubmitResponses = () => {
    const evaluatedResponses = responses.map((response, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === response.correct_option_index;
      return { ...response, isCorrect, selectedOptionIndex: userAnswer };
    });

    setResponses(evaluatedResponses);
    setSubmitted(true);
    handleSaveResponses(evaluatedResponses);
  };

  const handleSaveResponses = (evaluatedResponses) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to save responses.');
      return;
    }

    axios.post('http://localhost:8020/save-questions', { questions: evaluatedResponses, topic: prompt }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Responses saved successfully:', response.data);
    })
    .catch(error => {
      console.error('Error saving responses:', error);
      setError('Error saving responses. Please try again.');
    });
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-2/3 mx-auto p-5 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-indigo-500 mb-6">Quiz Generator</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Type any topic..."
            value={prompt}
            onChange={handlePrompt}
            className="px-4 py-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
          />
          <select
            value={difficulty}
            onChange={handleDifficultyChange}
            className="px-4 py-2 ml-4 border rounded-md focus:outline-none focus:border-indigo-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button type="submit" className="px-4 py-2 ml-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none">
            Submit
          </button>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {responses.map((response, index) => (
  <div key={index} className="mb-8">
    <p className="text-lg font-semibold mb-2">{response.question_text}</p>
    {response.options.map((option, i) => (
      <button
        key={i}
        onClick={() => handleOptionClick(index, i)}
        disabled={submitted}
        className={`block w-full text-left px-4 py-2 border rounded-full mb-4 
                    ${submitted ? 
                      (userAnswers[index] === i ? 
                        (response.isCorrect ? 'bg-green-300' : 'bg-red-300') 
                        : 'bg-gray-100') 
                      : (userAnswers[index] === i ? 'bg-purple-300' : 'bg-gray-100')} 
                    hover:bg-purple-200`}
      >
        {option}
      </button>
    ))}
  </div>
))}

        {responses.length > 0 && (
          <button
            onClick={handleSubmitResponses}
            disabled={submitted}
            className="block mx-auto px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatGpt;

