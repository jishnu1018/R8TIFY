import React from 'react'
import { Link } from 'react-router-dom'
Link
const Products1 = () => {
    return (
      <>
      <div className="flex flex-col md:flex-row justify-between items-center text-center h-auto p-6">
      <p className="text-4xl mt-3">Products</p>
      <Link to="/phones1"><div className="bg-black w-44 h-12 text-2xl pt-2 rounded-full mt-3 text-white">Smartphones</div></Link>
      <Link to="/laptops1"><div className="bg-black w-44 h-12 text-2xl pt-2 rounded-full mt-3 text-white">Laptops</div></Link>
      <Link to="/consoles1"><div className="bg-black w-52 h-12 text-2xl pt-2 rounded-full mt-3 text-white">Gaming Consoles</div></Link>
      <Link to="/cameras1"><div className="bg-black w-44 h-12 text-2xl pt-2 rounded-full mt-3 text-white">Camera</div></Link>
      </div>
      
  
      </>
    )
  }
  


export default Products1