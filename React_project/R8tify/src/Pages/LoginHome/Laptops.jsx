import React, { useEffect, useState } from "react";
import LoginNavbar from "../../components/LoginNavbar";
import { Link } from "react-router-dom";

const Laptops = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [reviewsExpanded, setReviewsExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/categoryproduct");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        const filteredProducts = data.filter((item) => item.category === "Laptops");
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
            const res = await fetch(
              `/api/review/product?name=${encodeURIComponent(product.Product_name)}`,
              {
                method: "GET",
                credentials: "include", // ✅ Ensures cookies are sent
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
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

  // Filter products based on the search term (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.Product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <>
      <LoginNavbar />
      <div className="p-8 space-y-6">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Laptops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2  w-[500px] rounded-2xl ml-[600px]"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            {products.length > 0 ? "No products match your search." : "No products available"}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-md bg-white flex flex-col md:flex-row gap-4">
              
              <div className="w-full md:w-1/4 flex flex-row items-center justify-center gap-2">
                {[product.image, product.image2].map((img, index) =>
                  img ? (
                    <img
                      key={index}
                      src={img.startsWith("http") ? img : `data:image/jpeg;base64,${img}`}
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
                <p className="text-xl font-bold">RS: {product.price}</p>
                
                <p className="text-yellow-500 font-semibold flex items-center">
                  ⭐ {calculateAverageRating(reviews[product._id])} 
                  <span className="text-gray-600 text-sm ml-2">
                    ({reviews[product._id]?.length || 0} reviews)
                  </span>
                </p>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Reviews:</h3>
                  {reviews[product._id]?.length > 0 ? (
                    <>
                      {reviews[product._id]?.slice(0, reviewsExpanded[product._id] ? reviews[product._id].length : 1).map((review, index) => (
                        <div key={review._id || index} className="border-t pt-2 mt-2 flex flex-col gap-3">
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

                      {reviews[product._id].length > 1 && (
                        <button 
                          onClick={() => setReviewsExpanded(prev => ({ ...prev, [product._id]: !prev[product._id] }))} 
                          className="text-blue-500 text-sm mt-2 underline hover:text-blue-700"
                        >
                          {reviewsExpanded[product._id] ? "Show Less" : "Show More Reviews"}
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
                <Link 
                  to="/addreview"
                  state={{ product }}
                  className="bg-black text-white px-4 py-2 rounded-full mt-2"
                >
                  Write a Review
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Laptops;
