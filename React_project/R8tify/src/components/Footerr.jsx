import React from 'react'
import {instagram,linkedin,twitter,facebook } from '../assets/Images/Images';


const Footerr = () => {
  return (
    <>
     {/* Footer */}
     <div className="bg-black w-full text-white grid grid-cols-1 md:grid-cols-3 mt-[122px] pt-4 pb-4 text-center md:text-left">
        <div className="px-6 md:ml-12 text-lg">
          <p>
            R8tify Inc.<br />
            Techno city,<br />
            Trivandrum, 1018<br /><br />
            Email: <a href="mailto:r8tifyinc@gmail.com" className="text-blue-500">r8tifyinc@gmail.com</a>
          </p>
        </div>
        <div className="text-center px-6">
          <p className="text-2xl">About us</p>
          <p className="text-sm mt-2">
            At R8TIFY, we empower confident decisions through trusted reviews. Our platform connects you with real user insights,<br />
            helping products shine and guiding you to the right choice.<br />
            Discover better. Choose smarter.
          </p>
          <hr className="my-4 border-gray-600" />
        </div>
        <div className="text-center px-6">
          <p>Follow us on:</p>
          <div className="flex justify-center space-x-2 mt-2">
            <a href="#">
              <img src={instagram} alt="Instagram logo" className="w-16 md:w-24" />
            </a>
            <a href="#">
              <img src={linkedin} alt="LinkedIn logo" className="w-12 md:w-[70px]" />
            </a>
            <a href="#">
              <img src={twitter} alt="Twitter logo" className="w-12 md:w-[60px] mt-2 md:mt-3" />
            </a>
            <a href="#">
              <img src={facebook} alt="Facebook logo" className="w-12 md:w-[70px]" />
            </a>
          </div>
        </div>
        <div className="mt-4 md:col-span-3 text-center">
          <p className="text-blue-500">&copy; 2025 R8TIFY, Inc. All rights reserved.</p>
        </div>
      </div>
    </>
  )
}

export default Footerr