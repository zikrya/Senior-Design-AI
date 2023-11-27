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
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmittingAnswers, setIsSubmittingAnswers] = useState(false);
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
        setIsLoading(true); // Start loading

        const topicToUse = retryTopic || prompt;
        fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ topic: topicToUse, difficulty })
        })
            .then(async (res) => {
                setIsLoading(false); // Stop loading
                if (res.ok) {
                    const json = await res.json();
                    setResponses(json);
                } else {
                    setError(`Error: ${res.status}. ${res.statusText}`);
                }
            })
            .catch((error) => {
                setIsLoading(false); // Stop loading on error
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
        setIsSubmittingAnswers(true);
        setSubmitted(true);
        handleSaveResponses(responses);
    };

    const handleSaveResponses = (evaluatedResponses) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to save responses.');
            setIsSubmittingAnswers(false);
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
                 'Submit'
                   )}
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
                    disabled={submitted || isSubmittingAnswers}
                    className="flex items-center justify-center mx-auto px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none"
                >
                    {isSubmittingAnswers ? (
                        <>
                            <svg aria-hidden="true" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span>Loading...</span>
                        </>
                    ) : (
                        'Submit Answers'
                    )}
                </button>

                )}
            </div>
        </div>
    );
};

export default ChatGpt;