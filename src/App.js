import './App.css';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";



function App() {
  return (

    <Router>
      <Routes>
        <Route exact path='/' element={<Login />} ></Route>
      </Routes>
    </Router>


  );
}

export default App;
