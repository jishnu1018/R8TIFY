import React from 'react'
import Navbar from '../../components/Navbar'
import Review from '../../components/Review'
import { Link } from 'react-router-dom'
import Products1 from '../../components/Products1'
import Four1 from '../../components/Four1'

const Categories1 = () => {
  return (
    <>
    <Navbar/>
    <Products1/>
    <Four1/>
    <Review/>
    </>
  )
}

export default Categories1