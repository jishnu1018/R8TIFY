import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logo } from '../assets/Images/Images';
import Footerr from '../components/Footerr';

const Signup = () => {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 7) {
      setPasswordError('Password must be at least 7 characters');
    } else {
      setPasswordError('');
    }

    if (Confirm && value !== Confirm) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setConfirm(value);

    if (value !== Password) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (Password.length < 7) {
      setError('Password must be at least 7 characters');
      return;
    }
    if (Password !== Confirm) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NAME: Name,
          EMAIL: Email,
          PASSWORD: Password,
          CONFIRM: Confirm,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Signup failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message || 'Signup failed: Please try again!');
    }
  };

  return (
    <div className="text-gray-800">
      <img src={logo} alt="logo" className="border border-black rounded-full w-24 h-20 mt-2 ml-2" />
      <div className="flex flex-col lg:flex-row items-center lg:items-start">
        <h1 className="text-6xl md:text-[150px] italic font-serif text-black drop-shadow-[0_0_3px_cyan] mt-10 md:mt-20 text-center lg:ml-[350px]">R8TIFY</h1>
        <p className="text-xl md:text-4xl text-center lg:text-left mt-6 md:mt-[354px] lg:ml-[-700px]">
          "Good reviews bring products to life, making them shine and transforming choices into confident decisions with trusted insights."
        </p>

        {/* Signup Form */}
        <div className="bg-black md:w-[527px] md:mr-[80px] md:h-[600px] lg:ml-[150px] rounded-[57px] p-8">
          <h1 className="text-white text-4xl md:text-[50px] font-serif text-center">Sign Up</h1>
          <form onSubmit={handleSignup}>
            <div className="mt-6">
              <label className="text-white text-lg md:text-xl font-light">Name</label>
              <input type="text" required className="w-full md:w-[400px] h-10 mt-1 ml-4 rounded-lg p-2 bg-white"
                value={Name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mt-6">
              <label className="text-white text-lg md:text-xl font-light">Email</label>
              <input type="email" required className="w-full md:w-[400px] h-10 mt-1 ml-4 rounded-lg p-2 bg-white"
                value={Email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mt-6">
              <label className="text-white text-lg md:text-xl font-light">Password</label>
              <input 
                type="password"
                required 
                className="w-full md:w-[400px] h-10 mt-1 ml-4 rounded-lg p-2 bg-white"
                value={Password} 
                onChange={handlePasswordChange} 
              />
              {passwordError && <p className="text-red-500 ml-4 mt-1">{passwordError}</p>}
            </div>
            <div className="mt-6 relative">
              <label className="text-white text-lg md:text-xl font-light">Confirm Password</label>
              <input 
                type={showConfirm ? "text" : "password"} 
                required 
                className="w-full md:w-[400px] h-10 mt-1 ml-4 rounded-lg p-2 bg-white pr-10"
                value={Confirm} 
                onChange={handleConfirmChange} 
              />
              <button 
                type="button" 
                className="absolute right-4 top-10 text-sm text-white bg-gray-700 px-2 py-1 rounded"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
              {confirmError && <p className="text-red-500 ml-4 mt-1">{confirmError}</p>}
            </div>
            <button type="submit" className="w-full md:w-[150px] h-[50px] mt-6 rounded-full border-2 border-black bg-white text-black text-xl font-bold cursor-pointer block mx-auto">
              Sign up
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            <p className="text-white text-lg text-center mt-2">
              Already a reviewer? <Link to="/login" className="text-blue-500 font-bold">Login</Link>
            </p>
          </form>
        </div>
      </div>
      <Footerr />
    </div>
  );
};

export default Signup;
