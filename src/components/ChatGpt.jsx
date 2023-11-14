import React, { useState } from 'react';
import axios from 'axios';

const ChatGpt = () => {
    const [prompt, setPrompt] = useState("");
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState("");

    const HTTP = "http://localhost:8020/chat";

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setResponses([]); // Clear previous responses

        axios.post(`${HTTP}`, { prompt })
            .then(res => {
                console.log('Full Response:', res);

                if (res.status >= 400) {
                    setError(`Error: ${res.status}. ${res.statusText}`);
                } else {
                    try {
                        let data = res.data;
                        console.log('Data received:', data); // Log the data to inspect

                        if (!Array.isArray(data) || data.length === 0) {
                            throw new Error('Data is not an array or is empty');
                        }

                        data.forEach(item => {
                            if (!item.question_text || !Array.isArray(item.options)) {
                                console.log('Invalid item:', item); // Log the problematic item
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
            .catch(error => {
                console.error('Request Error:', error.response?.data || error);
                setError(`An error occurred: ${error.response?.data?.message || error.message}`);
            });
    };

    const handlePrompt = (e) => setPrompt(e.target.value);

    const handleOptionClick = (selectedOptionIndex, correctOptionIndex) => {
        if (selectedOptionIndex === correctOptionIndex) {
            alert('Correct!');
        } else {
            alert('Incorrect!');
        }
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
                   </form>
                </div>
                <div className="mt-8 space-y-8">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {responses.map((response, index) => (
    <div key={index}>
        <div className="flex items-start">
            <p>{response.question_text}</p> {/* Use response.question_text */}
        </div>
        <div className="gap-4 md:grid-cols-2 mt-8">
            {Array.isArray(response.options) ? (
                response.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => handleOptionClick(i, response.correct_option_index)}
                        className="flex flex-row items-start bg-gray-100 hover:bg-gray-200 rounded-lg p-3 cursor-pointer group mb-4"
                    >
                        {option}
                    </button>
                ))
            ) : (
                <p style={{ color: 'red' }}>Options are not available.</p>
            )}
        </div>
        {Array.isArray(response.options) && ( // Ensure this line is correctly formatted
            <p>Correct Answer: {response.options[response.correct_option_index]}</p> // Use response.correct_option_index
        )}
    </div>
))}

                </div>
            </div>
        </div>
    );

}

export default ChatGpt;


