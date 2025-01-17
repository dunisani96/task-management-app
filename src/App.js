import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import TaskList from './components/TaskList';
import PrivateRoute from './components/PrivateRoute';
import Test from './components/Test';
import UserManagement from './components/UserManagement';
import TaskManagement from './components/TaskManagement';



function App() {
  
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route exact path='/' to={<Login />} ></Route>
        <Route exact path='/login' element={<Login />} ></Route>
        <Route path="/register" element={<Register/>} />  {/* Register route */}
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}></Route>
        <Route path='/tasks' element={<PrivateRoute><TaskList/></PrivateRoute>}></Route>
        <Route path='/test' element={<PrivateRoute><Test/></PrivateRoute>}></Route>
        <Route path='/user-management' element={<PrivateRoute><UserManagement/></PrivateRoute>}></Route>
        <Route path='/task-management' element={<PrivateRoute><TaskManagement/></PrivateRoute>}></Route>



      </Routes>
    </Router>
  );
}

export default App;
