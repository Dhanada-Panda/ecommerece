import React from 'react';
//import './signup.css';
import axios from 'axios';
import { useState } from 'react';
function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address:'',
    phonenumber:'',
    password: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/center', formData);
      if (response && response.data) {
        console.log('User registered successfully:', response.data);
        alert('registered sucessfully');
        //window.location.href="./signin";
        // Optionally, you can redirect the user to another page or show a success message
      } else {
        console.error('Empty response received');
        // Handle empty response: display error message or perform other actions
      }
    } catch (error) {
      console.error('Error registering user:', error.response.data);
      // Handle error: display error message or perform other actions
    }
  };
  return (
    <div className="signup-background">
      <div className="shape"></div>
      <div className="shape"></div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h3>Signup Here</h3>
        <input type="text" placeholder="Enter your name" name="name" value={formData.name} 
            onChange={handleChange} 
            required/>
        <input type="email" placeholder="Enter your email" name="email" value={formData.email} 
            onChange={handleChange} 
            required />
        <input type="text" placeholder="Enter your address" name="address" value={formData.address} 
            onChange={handleChange} 
            required/>
        <input type="text" placeholder="Enter your phone number" name="phonenumber" value={formData.phonenumber} 
            onChange={handleChange} 
            required/>
        <input type="password" placeholder="Enter your password" name="password" value={formData.password} 
            onChange={handleChange} 
            required/>

        <button className="signup-button" type="submit">Signup</button>

        <div className="social">
          {/*<div className="go"><i className="fab fa-google"></i> Google</div>*/}
          {/*<div className="fb"><i className="fab fa-facebook"></i> Facebook</div>*/}
          <div className="fb" onClick={() => {window.location.href = "/signin";}}><i className="fab fa-facebook"></i> Signin</div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
