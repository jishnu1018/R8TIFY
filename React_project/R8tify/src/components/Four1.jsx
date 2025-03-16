import React from 'react'
import { Link } from 'react-router-dom'
import { phone, console, laptop, camera } from '../assets/Images/Images'



const Four1 = () => {
    return (
      <div id="trending">
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 px-8">
        <div className="bg-black w-full h-64 rounded-xl flex flex-col items-center">
          <Link to="/phones1">
            <img src={phone} alt="Smartphones" className="w-48 h-48 rounded-full mt-2" />
            <p className="text-white font-bold">Smartphones</p>
          </Link>
        </div>
        <div className="bg-black w-full h-64 rounded-xl flex flex-col items-center">
          <Link to='/consoles1'>
            <img src={console} alt="Gaming Consoles" className="w-48 h-48 rounded-full mt-2" />
            <p className="text-white font-bold">Gaming Consoles</p>
          </Link>
        </div>
        <div className="bg-black w-full h-64 rounded-xl flex flex-col items-center">
          <Link to='/laptops1'>
            <img src={laptop} alt="Laptops" className="w-48 h-48 rounded-full mt-2" />
            <p className="text-white font-bold">Laptops</p>
          </Link>
        </div>
        <div className="bg-black w-full h-64 rounded-xl flex flex-col items-center">
          <Link to='/cameras1'>
            <img src={camera} alt="Cameras" className="w-48 h-48 rounded-full mt-2" />
            <p className="text-white font-bold">Cameras</p>
          </Link>
        </div>
      </div>
      </div>
    )
  }
  
export default Four1