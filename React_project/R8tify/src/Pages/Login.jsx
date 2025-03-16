import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logo } from '../assets/Images/Images';
import Footerr from '../components/Footerr';

const Login = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(Email)) {
      setError('Please enter a valid email');
      return;
    }
  
    try {
      let apiUrl = "/api/login"; 
      if (Email === "Admin@gmail.com") {
        apiUrl = "/api/adminlogin"; 
      }
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: Email, password: Password }), // ✅ Fix key casing
      });
  
      let responseData;
      try {
        responseData = await response.json();
      } catch (err) {
        throw new Error("Invalid server response");
      }
  
      if (!response.ok) {
        throw new Error(responseData.msg || 'Login failed');
      }
  
      console.log("User Data:", responseData);
      localStorage.setItem("userEmail", Email);
  
      navigate(Email === "Admin@gmail.com" ? '/admin' : '/home');
  
    } catch (err) {
      setError(err.message || 'Invalid credentials: Please try again!');
    }
  };
  

  return (
    <div className="text-gray-800">
      <img src={logo} alt="logo" className="border border-black rounded-full w-24 h-20 mt-2 ml-2" />

      <div className="flex flex-col lg:flex-row items-center lg:items-start">
        <h1 className="text-6xl md:text-[150px] italic font-serif text-black drop-shadow-[0_0_3px_cyan] mt-10 md:mt-20 text-center lg:ml-[350px]">
          R8TIFY
        </h1>

        <p className="text-xl md:text-4xl text-center lg:text-left mt-6 md:mt-[354px] lg:ml-[-700px]">
          "Good reviews bring products to life, making them shine and transforming choices into confident
          decisions with trusted insights."
        </p>

        {/* Login Form */}
        <div className="bg-black md:w-[527px] md:mr-[80px] md:h-[500px] lg:ml-[150px] rounded-[57px] p-8">
          <h1 className="text-white text-4xl md:text-[50px] font-serif text-center">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mt-6">
              <label className="text-white text-lg md:text-xl font-light">Email</label>
              <input
                type="email"
                required
                className="w-full md:w-[400px] h-10 mt-1 ml-4 rounded-lg p-2 bg-white"
                value={Email}
                onChange={handleEmailChange}
              />
              {emailError && <p className="text-red-500 ml-4 mt-1">{emailError}</p>}
            </div>

            <div className="mt-6 relative">
              <label className="text-white text-lg md:text-xl font-light">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full md:w-[400px] h-10 mt-1 ml-4 rounded-lg p-2 bg-white pr-10"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-10 text-sm text-white bg-gray-700 px-2 py-1 rounded"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full md:w-[150px] h-[50px] mt-6 rounded-full border-2 border-black bg-white text-black text-xl font-bold cursor-pointer block mx-auto"
            >
              Login
            </button>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <p className="text-white text-lg text-center mt-2">
              Don't have an account? <Link to="/signup" className="text-blue-500 font-bold">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
      <Footerr />
    </div>
  );
};

export default Login;
