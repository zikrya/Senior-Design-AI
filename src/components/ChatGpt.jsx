import React, { useState } from 'react';
import axios from 'axios';

const ChatGpt = () => {
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");

  const HTTP = "http://localhost:8020/chat";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResponses([]);

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

  const handleOptionClick = (selectedOptionIndex, correctOptionIndex, responseIndex) => {
    const newResponses = [...responses];
    newResponses[responseIndex] = { ...newResponses[responseIndex], selectedOptionIndex };

    if (selectedOptionIndex === correctOptionIndex) {
      newResponses[responseIndex].isCorrect = true;
    } else {
      newResponses[responseIndex].isCorrect = false;
    }

    setResponses(newResponses);
  };

  return (
    <div>
      <div className="w-full md:w-2/3 mx-auto p-5 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <h2 className="text-center text-3xl font-extrabold text-indigo-400">Quiz Generator</h2>
          </div>
        </div>
        <br />
        <div className="flex justify-center items-center">
          <form onSubmit={handleSubmit} className="flex border-2 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Type any topic..."
              value={prompt}
              onChange={handlePrompt}
              className="px-4 py-2 w-full"
            />
            <select
              value={difficulty}
              onChange={handleDifficultyChange}
              className="px-4 py-2"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white">Submit</button>
          </form>
        </div>
        <div className="mt-8 space-y-8">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {responses.map((response, index) => (
            <div key={index}>
              <div className="flex items-start">
                <p>{response.question_text}</p>
              </div>
              <div className="gap-4 md:grid-cols-2 mt-8">
                {Array.isArray(response.options) ? (
                  response.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(i, response.correct_option_index, index)}
                      className={`flex flex-row items-start rounded-lg p-3 cursor-pointer group mb-4 ${
                        response.selectedOptionIndex !== undefined
                          ? response.selectedOptionIndex === i
                            ? response.isCorrect
                              ? 'bg-green-300'
                              : 'bg-red-300'
                            : ''
                          : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  <p style={{ color: 'red' }}>Options are not available.</p>
                )}
              </div>
              {Array.isArray(response.options) && (
                <p style={{ display: 'none' }}>Correct Answer: {response.options[response.correct_option_index]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatGpt;



