import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logo, search } from '../assets/Images/Images';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-black w-full h-auto md:h-24 flex flex-col md:flex-row items-center px-4 py-2">
      <div className="flex justify-between w-full md:w-auto">
        <Link to='/home1'>
          <img src={logo} alt="logo" className="border border-black rounded-full w-24 h-16" />
        </Link>

        <h1 className="text-white text-2xl italic font-serif ml-4 mt-4 md:ml-2">
          R8TIFY.com
        </h1>

        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="text-white text-3xl md:hidden ml-auto"
        >
          ☰
        </button>
      </div>

      <div className={`${menuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto items-center mt-4 md:mt-0`}>
        <div className="flex flex-col md:flex-row md:ml-96 w-full md:w-auto items-center">
          
          <div className="flex w-full md:w-auto mt-2 md:mt-0">
            <input 
              type="text" 
              placeholder="Search" 
              className="h-10 w-full md:w-[400px] rounded-l-full pl-4 text-lg bg-white"
              
            />
            <button className="h-10 w-12 bg-white border-2 border-gray-300 rounded-r-full flex items-center justify-center cursor-not-allowed">
              <img src={search} alt="Search" className="h-6 w-6" />
            </button>
          </div>

          <Link to='/categories1' className="text-lg font-bold rounded px-4 h-10 py-1 bg-white mt-2 md:mt-0 md:ml-24">
            Categories
          </Link>
          <a
            href="#trending"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-lg font-bold rounded px-4 h-10 py-1 bg-white mt-2 md:mt-0 md:ml-24"
          >
            Trending Insights
          </a>
          <Link to="/signup" className="text-lg font-bold rounded px-4 h-10 py-1 bg-white mt-2 md:mt-0 md:ml-24">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
