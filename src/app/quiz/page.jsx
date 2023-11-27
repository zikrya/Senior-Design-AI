"use client";

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ChatGpt = () => {
    const [prompt, setPrompt] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState("");
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const params = useSearchParams();

    useEffect(() => {
        const topic = params.get('topic');
        if (topic) {
            setPrompt(topic);
            handleSubmit(null, topic);
        }
    }, [params]);

    const HTTP = "/api/chat";

    const handleSubmit = (e, retryTopic) => {
        if (e) e.preventDefault();
        setError('');
        setUserAnswers({});
        setResponses([]);
        setSubmitted(false);

        const topicToUse = retryTopic || prompt;
        fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ topic: topicToUse, difficulty })
        })
            .then(async (res) => {
                if (res.ok) {
                    const json = await res.json();
                    setResponses(json);
                } else {
                    setError(`Error: ${res.status}. ${res.statusText}`);
                }
            })
            .catch((error) => {
                setError(`An error occurred: ${error.message}`);
                console.error('Request Error:', error);
            });
    };

    const handlePrompt = (e) => setPrompt(e.target.value);
    const handleDifficultyChange = (e) => setDifficulty(e.target.value);

    const handleOptionClick = (responseIndex, selectedOptionIndex, correctOptionIndex) => {
        const isCorrect = selectedOptionIndex === correctOptionIndex;
        setUserAnswers({ ...userAnswers, [responseIndex]: selectedOptionIndex });
        // Update the response immediately with the correctness
        const updatedResponses = responses.map((response, index) => {
            if (index === responseIndex) {
                return { ...response, isCorrect, selectedOptionIndex: selectedOptionIndex };
            }
            return response;
        });
        setResponses(updatedResponses);
    };

    const handleSubmitResponses = () => {
        setSubmitted(true);
        handleSaveResponses(responses);
    };

    const handleSaveResponses = (evaluatedResponses) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to save responses.');
            return;
        }

        axios.post(`/api/save-questions`, { questions: evaluatedResponses, topic: prompt }, {
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
                                onClick={() => handleOptionClick(index, i, response.correct_option_index)}
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