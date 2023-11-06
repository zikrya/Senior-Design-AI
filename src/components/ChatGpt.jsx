import { useState } from "react";
import axios from 'axios';

const ChatGpt = () => {
    const [prompt, setPrompt] = useState("");
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState("");

    const HTTP = "http://localhost:8020/chat";

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setResponses([]); // Clear previous responses
        axios.post(`${HTTP}`, { prompt })
            .then(res => {
                if (res.status >= 400) {
                    setError(`Error: ${res.status}. ${res.statusText}`);
                } else {
                    // Assuming the backend sends a JSON object
                    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                    setResponses([data]); // Now responses will be an array of question objects
                }
            })
            .catch(error => {
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
            <div>
                {error ? <p style={{ color: 'red' }}>{error}</p> : null}
                {responses.map((response, index) => (
                    <div key={index}>
                        <p>{response.question}</p>
                        {response.options.map((option, i) => (
                            <button key={i} onClick={() => handleOptionClick(i, response.correctAnswer)}>
                                {option}
                            </button>
                        ))}
                        <p>Correct Answer: {String.fromCharCode(65 + response.correctAnswer)}</p>
                    </div>
                ))}
                {responses.length === 0 && !error && "Ask me anything"}
            </div>
        </div>
    );
}

export default ChatGpt;


