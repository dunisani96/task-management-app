import "./App.css";
import CreateOrganization from "./components/CreateOrganization";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/dashboard" element={<Dashboard />}></Route>
        <Route exact path="/create" element={<CreateOrganization/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
