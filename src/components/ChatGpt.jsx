import { useState } from "react";
import axios from 'axios';

const ChatGpt = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState(""); // State to handle and display error messages

    const HTTP = "http://localhost:8020/chat";

    const handleSubmit = (e) => {
        e.preventDefault();
        // Resetting error state upon new submission
        setError("");
        axios.post(`${HTTP}`, { prompt })
            .then(res => {
                // Handling the possibility of receiving an error message as a response
                if (res.status >= 400) {
                    setError(`Error: ${res.status}. ${res.data}`);
                } else {
                    setResponse(res.data);
                }
            })
            .catch(error => {
                // Improved error handling
                if (error.response) {
                    // The request was made and the server responded with a status code outside the range of 2xx
                    setError(`Error: ${error.response.status}. ${error.response.data}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    setError("Error: The request was sent but no response was received");
                } else {
                    // Something happened in setting up the request and triggered an Error
                    setError(`Error: ${error.message}`);
                }
            });
    }
    const handlePrompt = (e) => setPrompt(e.target.value);

    return (
        <div>
            <div>Test Gpt</div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="type here..." value={prompt} onChange={handlePrompt} />
            </form>
            <div>
                {/* Display error message if there is an error */}
                {error ? <p style={{ color: 'red' }}>{error}</p> : null}
                {/* Display response or default message */}
                <p>{response ? response : "Ask me anything"}</p>
            </div>
        </div>
    );
}

export default ChatGpt;
