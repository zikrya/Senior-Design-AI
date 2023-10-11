import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import ChatGpt from './components/ChatGpt'
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {

  return (
    <>
        <Router>
          <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/register" element={
          <Register/>} />
           <Route exact path="/register" element={<Dashboard/>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
