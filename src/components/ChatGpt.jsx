import React, { useState } from 'react';
import axios from 'axios';

const ChatGpt = () => {
    const [prompt, setPrompt] = useState("");
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState("");

    const HTTP = "http://localhost:8020/chat";

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setError("");
    //     setResponses([]); // Clear previous responses
    //     axios.post(`${HTTP}`, { prompt })
    //         .then(res => {
    //             console.log('Full Response:', res);
    //             if (res.status >= 400) {
    //                 setError(`Error: ${res.status}. ${res.statusText}`);
    //             } else {
    //                 // Assuming the backend sends a JSON object
    //                 // console.log(res.data[0])
    //                 const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    //                 setResponses([data]); // Now responses will be an array of question objects
    //                 // console.log('Received JSON data:', data);
                    
    //             }
    //         })
    //         .catch(error => {
    //             setError(error.message);
    //         });
    // };
   
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
                const rawData = res.data;
                const data = Array.isArray(rawData) ? rawData : [rawData];
      
                setResponses(data);
                console.log(data);
              } catch (error) {
                console.error('Error parsing JSON:', error);
                setError('Error parsing JSON');
              }
            }
          })
          .catch(error => {
            console.error('Raw Response:', error.response.data);
            setError(error.message);
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
            <div>Test Gpt</div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="type here..." value={prompt} onChange={handlePrompt} />
                <button type="submit">Submit</button>
            </form>

            <div className="w-full md:w-2/3 mx-auto p-5 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div className="w-2/3">
                    <h2 className="section-heading text-bold">Question</h2>
                    </div>
                </div>
                <div className="mt-8 space-y-8">
                    <div>
                    {error ? <p style={{ color: 'red' }}>{error}</p> : null}
                    {responses.map((response, index) => (
                        <div  key={index}>
                            <div className="flex items-start">
                                <p>{response.question}</p>
                            </div>
                            <div className="gap-4 md:grid-cols-2 mt-8">
                                <div>
                                    {response.options.map((option, i) => (
                                        <button
                                        key={i} onClick={() => handleOptionClick(i, response.correctAnswer)}
                                        className="flex flex-row items-start bg-gray-100 hover:bg-gray-200 rounded-lg p-3 cursor-pointer group mb-4"
                                        >
                                            {option}  
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p 
                            // style={{ opacity: 0 }} 
                            >Correct Answer: {response.options[response.correctAnswer]}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatGpt;


