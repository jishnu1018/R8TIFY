import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/adminproducts");
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products.");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/adminproducts/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
        alert("Product deleted successfully!");
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Manage Products</h2>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {products.length > 0 ? (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-6 py-3 text-left">Image</th>
                  <th className="px-6 py-3 text-left">Product ID</th>
                  <th className="px-6 py-3 text-left">Product Name</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-100 transition">
                    <td className="px-6 py-2">
                      {product.image ? (
                        <img
                        src={product.image ? `data:image/png;base64,${product.image}` : "/placeholder.jpg"}
                        alt={product.Product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-2">{product._id}</td>
                    <td className="px-6 py-2">{product.Product_name}</td>
                    <td className="px-6 py-2">{product.category || "N/A"}</td>
                    <td className="px-6 py-2">${product.price}</td>
                    <td className="px-6 py-2 flex space-x-2">
                      <button
                        onClick={() => navigate(`/editproducts/${product._id}`)}
                        className="bg-blue-500 text-white rounded-md px-4 py-1 hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-500 text-white rounded-md px-4 py-1 hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500">No products found.</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Link to="/admin">
          <button className="bg-black text-white text-xl px-6 py-3 rounded-full font-bold hover:opacity-80 transition">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminProducts;
