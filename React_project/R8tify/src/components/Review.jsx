import React, { useEffect, useState } from "react";

const Review = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/randomproducts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setError("No products and reviews found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, []);

  const renderStars = (rating) => {
    if (!rating) return <p className="text-gray-500">No rating</p>;
    const fullStars = "\u2605".repeat(Math.floor(rating));
    const emptyStars = "\u2606".repeat(5 - Math.floor(rating)); 
    return (
      <p className="text-yellow-500 text-lg">
        {fullStars}{emptyStars} ({rating}/5)
      </p>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-4">
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading reviews...</p>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : products.length > 0 ? (
        products.map((product, index) => {
          const hasReviews = product.reviews?.length > 0;
          const firstReview = hasReviews ? product.reviews[0] : null;
          const rating = firstReview?.rating ? Math.round(firstReview.rating) : null;

          return (
            <div key={index} className="border-2 border-black rounded-3xl p-4">
              <div className="flex items-center space-x-4">
                <img
                  alt="User"
                  src={firstReview?.profilePic || "/default-user.png"}
                  className="rounded-full w-14 h-16"
                />

                <div>
                  <p className="text-2xl">{firstReview?.username || "Anonymous"}</p>
                  {renderStars(rating)}
                </div>

                <div className="text-center text-red-400 text-2xl font-bold">
                  {product.name}
                  <br />
                  <span className="text-black text-lg font-bold">
                    {firstReview?.title || "No comment"}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-lg">{firstReview?.comment || "No reviews yet."}</p>

              {firstReview?.images?.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {firstReview.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.startsWith("http") ? img : `data:image/jpeg;base64,${img}`}
                      alt="Review Image"
                      className="w-20 h-20 rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 text-lg">No reviews yet.</p>
      )}
    </div>
  );
};

export default Review;
