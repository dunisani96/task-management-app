import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";



function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login />} ></Route>
        <Route path="/register" element={<Register/>} />  {/* Register route */}

      </Routes>
    </Router>
  );
}

export default App;
