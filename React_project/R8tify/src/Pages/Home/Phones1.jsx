import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'; 
import Navbar from '../../components/Navbar';

const Phones1 = () => {
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState({});
    const [reviewsExpanded, setReviewsExpanded] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    const checkAuthCookie = () => {
      return document.cookie.split("; ").some((cookie) => cookie.startsWith("authToken="));
  };

  useEffect(() => {
      setIsLoggedIn(checkAuthCookie());
  }, []);


    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await fetch("http://localhost:9001/categoryproduct");
          if (!res.ok) throw new Error("Failed to fetch products");
  
          const data = await res.json();
          const filteredProducts = data.filter((item) => item.category === "Phones");
          setProducts(filteredProducts);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProducts();
    }, []);
  
    useEffect(() => {
      if (products.length === 0) return;
  
      const fetchReviews = async () => {
        const newReviews = {};
        await Promise.all(
          products.map(async (product) => {
            try {
              const url = `http://localhost:9001/api/review/product?name=${encodeURIComponent(product.Product_name)}`;
              console.log("Fetching reviews from:", url);
  
              const res = await fetch(url);
              if (!res.ok) throw new Error(`Failed to fetch reviews for ${product.Product_name}`);
  
              const reviewData = await res.json();
              newReviews[product._id] = reviewData.reviews || [];
            } catch (err) {
              console.error(err.message);
              newReviews[product._id] = [];
            }
          })
        );
        setReviews(newReviews);
      };
  
      fetchReviews();
    }, [products]);
  
    const calculateAverageRating = (reviews) => {
      if (!reviews || reviews.length === 0) return "No ratings yet";
      const validRatings = reviews
        .map((review) => Number(review.rating))
        .filter((rating) => !isNaN(rating) && rating > 0);
    
      if (validRatings.length === 0) return "No ratings yet";
      
      const totalRating = validRatings.reduce((sum, rating) => sum + rating, 0);
      return (totalRating / validRatings.length).toFixed(1); 
    };
  
    const handleWriteReview = () => {
      if (!checkAuthCookie()) {
          setShowPopup(true);
      }
  };

    if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;
  
    return (
      <>
        <Navbar />
        <div className="p-8 space-y-6">
          {products.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No products available.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 shadow-md bg-white flex flex-col md:flex-row gap-4">
                
                <div className="w-full md:w-1/4 flex flex-row items-center justify-center gap-2">
                  {[product.image, product.image2].map((img, index) =>
                    img ? (
                      <img
                        key={index}
                        src={
                          img.startsWith("http")
                            ? img
                            : `data:image/jpeg;base64,${img}` 
                        }
                        alt={`${product.Product_name} image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-md"
                        onError={(e) => { e.target.src = "/default-image.png"; }}
                      />
                    ) : null
                  )}
                </div>
  
                <div className="w-full md:w-2/4">
                  <h2 className="text-xl font-bold">{product.Product_name}</h2>
                  <p className="text-gray-600">{product.Product_description}</p>
                  
                  <p className="text-yellow-500 font-semibold flex items-center">
    ⭐ {calculateAverageRating(reviews[product._id])}
  </p>
  
                  <div className="mt-4">
     <h3 className="text-lg font-semibold">Reviews:</h3>
     {reviews[product._id]?.length > 0 ? (
        <>
           {reviews[product._id]?.slice(0, 1).map((review) => (
              <div key={review._id} className="border-t pt-2 mt-2 flex flex-col gap-3">
                 <div className="flex justify-between items-start gap-3">
                    
                    <div className="flex items-start gap-3">
                      
                       <img 
                          src={review.profilePic || "/default-profile.png"} 
                          alt={review.username} 
                          className="w-10 h-10 rounded-full object-cover border"
                          onError={(e) => { e.target.src = "/default-profile.png"; }} 
                       />
                     
                       <div>
                          <p className="font-semibold">{review.username}</p>
                          <p className="text-yellow-500 flex items-center">⭐ {review.rating}/5</p>
                          <p className="text-gray-700">{review.comment}</p>
                       </div>
                    </div>
  
                   
                    {review.images?.length > 0 && (
                       <div className="flex gap-2 ml-auto">
                          {review.images.map((img, i) => (
                             <img 
                                key={i} 
                                src={img.startsWith("http") ? img : `data:image/jpeg;base64,${img}`} 
                                alt="Review Image" 
                                className="w-20 h-20 object-cover rounded-md"
                                onError={(e) => { e.target.src = "/default-image.png"; }} 
                             />
                          ))}
                       </div>
                    )}
                 </div>
              </div>
           ))}
  
       
           {reviews[product._id].length > 1 && !reviewsExpanded[product._id] && (
              <button 
                 onClick={() => setReviewsExpanded(prev => ({ ...prev, [product._id]: true }))} 
                 className="text-blue-500 text-sm mt-2 underline hover:text-blue-700"
              >
                 Show More Reviews
              </button>
           )}
  
          
           {reviewsExpanded[product._id] &&
              reviews[product._id].slice(1).map((review) => (
                 <div key={review._id} className="border-t pt-2 mt-2 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-3">
                       
                       <div className="flex items-start gap-3">
                         
                          <img 
                             src={review.profilePic || "/default-profile.png"} 
                             alt={review.username} 
                             className="w-10 h-10 rounded-full object-cover border"
                             onError={(e) => { e.target.src = "/default-profile.png"; }} 
                          />
                          
                          <div>
                             <p className="font-semibold">{review.username}</p>
                             <p className="text-yellow-500 flex items-center">⭐ {review.rating}/5</p>
                             <p className="text-gray-700">{review.comment}</p>
                          </div>
                       </div>
  
                       {review.images?.length > 0 && (
                          <div className="flex gap-2 ml-auto">
                             {review.images.map((img, i) => (
                                <img 
                                   key={i} 
                                   src={img.startsWith("http") ? img : `data:image/jpeg;base64,${img}`} 
                                   alt="Review Image" 
                                   className="w-20 h-20 object-cover rounded-md"
                                   onError={(e) => { e.target.src = "/default-image.png"; }} 
                                />
                             ))}
                          </div>
                       )}
                    </div>
                 </div>
              ))
           }
  
           
           {reviewsExpanded[product._id] && (
              <button 
                 onClick={() => setReviewsExpanded(prev => ({ ...prev, [product._id]: false }))} 
                 className="text-blue-500 text-sm mt-2 underline hover:text-blue-700"
              >
                 Show Less
              </button>
           )}
        </>
     ) : (
        <p className="text-gray-500 text-sm">No reviews yet.</p>
     )}
  </div>
  
                </div>
  
              
                <div className="w-full md:w-1/4 flex flex-col items-end justify-between">
                  <span className="text-lg font-bold bg-yellow-400 px-3 py-1 rounded-md">
                    Rs{product.price}
                  </span>
                  {isLoggedIn ? (
                                    <Link 
                                        to="/addreview"
                                        state={{ product }}
                                        className="bg-black text-white px-4 py-2 rounded-full mt-2"
                                    >
                                        Write a Review
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleWriteReview}
                                        className="bg-black text-white px-4 py-2 rounded-full mt-2"
                                    >
                                        Write a Review
                                    </button>
                                )}
                </div>
              </div>
            ))
          )}
        </div>
        {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold">You need to log in to write a review</p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
      </>
    );
  };
  
export default Phones1