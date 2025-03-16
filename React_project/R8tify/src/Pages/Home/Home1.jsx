import React from 'react'
import Navbar from '../../components/Navbar'
import { homeimg } from '../../assets/Images/Images'
import Footerr from '../../components/Footerr'
import Four1 from '../../components/Four1'


const Home1 = () => {
  return (
    <>
    <Navbar/>
    <div className="text-center mt-8">
      <img src={homeimg} alt="image" className="mx-auto"/>
      <h1 className="text-5xl mt-4">Reviews that matter, choices that count.</h1>
    </div>
    <div className="text-center mt-12 ">
        <p className="text-2xl">Popular Categories</p>
        <p className="text-lg">Browse our most popular categories</p>
    </div>
    <Four1/>
    <Footerr/>
    
    </>
  )
}

export default Home1