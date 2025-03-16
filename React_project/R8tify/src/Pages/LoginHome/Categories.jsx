import React from 'react'
import LoginNavbar from '../../components/LoginNavbar'
import Products from '../../components/Products'
import Four from '../../components/Four'
import Review from '../../components/Review'
import { Link } from 'react-router-dom'

const Categories = () => {
  return (
    <>
    <LoginNavbar/>
    <Products/>
    <Four/>
    <Review/>
    </>
  )
}

export default Categories