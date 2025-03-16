import React from 'react'
import { Link } from 'react-router-dom'

const Products = () => {
  return (
    <>
    <div className="flex flex-col md:flex-row justify-between items-center text-center h-auto p-6">
    <p className="text-4xl mt-3">Products</p>
    <Link to="/phones"><div className="bg-black w-44 h-12 text-2xl pt-2 rounded-full mt-3 text-white">Smartphones</div></Link>
    <Link to="/laptops"><div className="bg-black w-44 h-12 text-2xl pt-2 rounded-full mt-3 text-white">Laptops</div></Link>
    <Link to="/consoles"><div className="bg-black w-52 h-12 text-2xl pt-2 rounded-full mt-3 text-white">Gaming Consoles</div></Link>
    <Link to="/cameras"><div className="bg-black w-44 h-12 text-2xl pt-2 rounded-full mt-3 text-white">Camera</div></Link>
    </div>
    

    </>
  )
}

export default Products