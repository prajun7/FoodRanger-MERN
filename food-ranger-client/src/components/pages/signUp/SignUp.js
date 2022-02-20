/*
Signup page,
same as in login page, once the user signs up, we store the user inforamation inside the context
*/

import React , { useState , useContext} from 'react';
import { Link, useHistory } from "react-router-dom";
import { UserContext } from '../../../contexts/UserContext';
import './SignUp.css';

// This will be the SignUp Page,
// User will be able to SigUp from this page, if they don't have an account

const API_BASE = "http://localhost:9000";

function SignUp() {
  
  const[name, setName] = useState('');  //Use state for getting name from the user's inputs
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[loading,setLoading] = useState(false);
  const[error, setError] = useState(null);
 // const[successMessage, setSuccessMessage] = useState(null);
 // No need to use successMessage as we are directly taking the user to home page once logged in
  const history = useHistory();

  // Using the Context to store the user's information
  // We are setiing the loggedIn status to true and setting the user information once the user logs in 
  const {setLoggedIn, setUser} = useContext(UserContext);

  /*
    This removes the underline and makes the text blue from the links
    Used below in Forgot Password? and Need an Account?
  */
    const navStyle ={
      color : 'blue',
      textDecoration : 'none'   // Removing the text-decoration(underline) from the links
      // In Javascript while writing CSS we need to change text-decoration to textDecoration
  };

/*
  Creates the user and stores it in database
  Backend checks for duplicate emails, hash passwords, and validates the user's inputs
  Check backend node.js project that is food-app-server folder
*/
const handleSubmitSignUp = async (e) => {
  e.preventDefault();   // To prevent the auto reload of the page
  try{  //Using try catch block to handle the connection errors

    setLoading(true)
    const res = await fetch(         // Similar to the post request that we do in postman
      `${API_BASE}/auth/register`,{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        name : name,                 //pasing the name,email and password from the form(frontend)
        email : email,
        password : password
      })
    });

     // console.log(res);   //this prints out the response object

    const data = await res.json();
    //  console.log(data);   //this prints the data/error from the server

    // Need to use res.ok, to handle the server's errors
    if (!res.ok){
      setError(data.error);   // in backend we set, {'error' : "Email alredy exists"}
                              // so, we are doing data.error

    //  setSuccessMessage(null);   //need to set this to null so, that both error and success message
    }                            // won't show up together

    if(res.ok){
     // setSuccessMessage("User Successfull Registered");
     // console.log(data.user_info_backend);  // This will give us the user information that we just created.
                    // In backend we set, res.send({'user_info_backend': user });

      setError(null);  // Need to set this to null so, that both error and success message
                       //  won't show up together

      // Using ContextAPI to store the user info that is just signed up,
      setLoggedIn(true);                  // Setting true for user is logged in
      setUser(data.user_info_backend);    // Setting the user information

      // Must use return here, to prevent memory leakage
      return history.push('/');
      // After sucessfully logged in, go to home page
    }

      /*
      // Another way to pass user information is by using second parameter of useHistory
      // And also by usng useLocation
      //  But it is better to use the Context API, as it makes easier to pass data in different components

      // Must use return here, to prevent memory leakage
      return history.push("/user",{user_info_frontend : data.user_info_backend});
      // By using second parameter in history.push we are sinding that user information
      // We need to use useLocation hook in "/user" page to get those info
      // But instead of using all there, we can use Context API and store the user in the context for easy access

      */
    
  } catch(err) {   //This is to handle network/connection errors
    setError(err.message);
  //  setSuccessMessage(null);
  }
  setLoading(false);
}

  return (
    <div>
    { error && <div className = 'error-message'>{error}</div>}
      {/* { successMessage && <div className = "success-message">{successMessage}</div> } */}
      {/* Only load this if error or successMessage is present */}

    <div className='signup'>
        <h1>Sign Up</h1>
        <form >
          <label>Name</label>
            <input 
              type = "text"
              placeholder='Enter Name'
              required
              onChange={(e) => setName(e.target.value)}
            />

          <label>Email</label>
            <input 
              type = "email"
              placeholder='Enter email'
              required
              onChange={(e) => setEmail(e.target.value)}
            />

          <label>Password</label>
            <input 
              type = "password"
              placeholder='Enter Password'
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          <button disabled = {loading} onClick={handleSubmitSignUp}> Sign Up </button>
        </form>
     </div>  {/* end of div className = signup */}

      {/* ** Already have an account? Log In  ** */}
      <div className='already-account-text'>
        Already have an account? 
        <Link style = {navStyle} to = "/login">
           Log In
        </Link>
      </div>
  </div>
  );
}

export default SignUp;