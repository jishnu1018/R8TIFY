import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Seereviews = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleExpand = (productId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleDeleteReview = async (reviewId, productId) => {
    const reason = prompt("Enter reason for deleting this review:");
    if (!reason) {
        alert("Deletion reason is required.");
        return;
    }

    try {
        const response = await axios.request({
            method: "DELETE",
            url: `/api/review/reviews/${reviewId}`,
            headers: { "Content-Type": "application/json" },
            data: { reason, adminId: "your_admin_id_here" }, // Ensure adminId is sent
            withCredentials: true,
        });

        if (response.status === 200) {
            alert("Review deleted successfully!");

            // Update UI to remove deleted review
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === productId
                        ? { ...product, reviews: product.reviews.filter((r) => r._id !== reviewId) }
                        : product
                )
            );
        }
    } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review.");
    }
};



  if (loading) return <p className="text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button onClick={() => navigate("/admin")} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Back to Admin
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center">Product Reviews</h1>
      <div className="space-y-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="bg-white p-4 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold">{product.Product_name}</h2>
              <p className="text-gray-600">{product.Product_description}</p>

              <div className="flex space-x-4 mt-2">
                {product.image && (
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.Product_name}
                    className="w-24 h-24 object-cover rounded-lg shadow"
                  />
                )}
                {product.image2 && (
                  <img
                    src={`data:image/jpeg;base64,${product.image2}`}
                    alt={product.Product_name}
                    className="w-24 h-24 object-cover rounded-lg shadow"
                  />
                )}
              </div>

              <p className="mt-2 font-bold text-green-600">Price: ₹{product.price}</p>

              <h3 className="mt-4 font-semibold">Reviews:</h3>
              <div className="space-y-2">
                {product.reviews && product.reviews.length > 0 ? (
                  <>
                    {product.reviews.slice(0, expandedReviews[product._id] ? product.reviews.length : 1).map((review) => (
                      <div key={review._id} className="p-3 border rounded-lg bg-gray-50 relative">
                        <div className="flex items-center space-x-2">
                          {review.userId && review.userId.image && (
                            <img
                              src={review.userId.image.startsWith("data:image") ? review.userId.image : `data:image/jpeg;base64,${review.userId.image}`}
                              alt={review.userId.name || "User"}
                              className="w-8 h-8 rounded-full shadow"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          )}
                          <p className="font-medium">{review.userId ? review.userId.name : "Anonymous"}</p>
                        </div>
                        <p className="text-yellow-500">⭐ {review.star}/5</p>
                        <p className="text-gray-700">{review.about}</p>

                        {/* Delete Review Button */}
                        <button
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteReview(review._id, product._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))}
                    {product.reviews.length > 1 && (
                      <button
                        className="mt-2 text-blue-500 hover:underline"
                        onClick={() => toggleExpand(product._id)}
                      >
                        {expandedReviews[product._id] ? "See Less" : "See More"}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Seereviews;