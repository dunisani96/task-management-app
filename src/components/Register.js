import { useState } from "react";
import "../styles/Auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

const history= useNavigate();
  const handleSignUp= async (e)=>{
    e.preventDefault();

    const response= await axios.post( 
        "http://localhost/task_management_backend/api/users/register.php",
        {firstName,lastName,email,password}
    )

    if(response===200){
        const {data}= response;
        if(data.success){
            console.log("User created");
            history.push("/login")
        }else{
            setError(data.message || "Login failed , please try again..")
        }
    }else{
        setError("An error occured , please try again..")
    }


  }

  return (
    <>
      <h1>Register User</h1>

      <div>
        <form onSubmit={handleSignUp}>
          <div className="m-2">
            <input
              className="form-control"
              placeholder="First name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
          </div>
          <div className="m-2">
            <input
              className="form-control"
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>
          </div>
          <div className="m-2">
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          {/* <div className="m-2">
            <input
              className="form-control"
              placeholder="Role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            ></input>
          </div> */}
          {/* <div className="m-2">
            <input
              className="form-control"
              placeholder="Organisation"
              type="text"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
            ></input>
          </div> */}
          <div className="m-2">
            <input
              className="form-control"
              placeholder="Password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <div>
            <button type="submit" className="btn-primary flex w-full justify-center">Submit</button>
          </div>
          {error && <p className="text-danger">{error}</p>}

        </form>

      </div>
    </>
  );

};

export default Register;
