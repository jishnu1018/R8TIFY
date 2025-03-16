import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    Product_name: "",
    Description: "",
    price: "",
    category: "",
    image: null,
    image2: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview1, setPreview1] = useState(""); 
  const [preview2, setPreview2] = useState(""); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/adminproducts/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();
        setProduct({
          Product_name: data.Product_name,
          Description: data.Product_description || "",
          price: data.price,
          category: data.category || "",
        });

        if (data.image) setPreview1(`data:image/png;base64,${data.image}`);
        if (data.image2) setPreview2(`data:image/png;base64,${data.image2}`);

        setLoading(false);
      } catch (error) {
        setError("Error fetching product details");
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, imageField) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, [imageField]: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageField === "image") setPreview1(reader.result);
        else setPreview2(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("Product_name", product.Product_name);
    formData.append("Description", product.Description);
    formData.append("Price", product.price);
    formData.append("Category", product.category);

    if (product.image) formData.append("productimage1", product.image);
    if (product.image2) formData.append("productimage2", product.image2);

    try {
      const response = await fetch(`/api/adminproducts/${id}`, {
        method: "PUT",
        body: formData, 
      });

      if (!response.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      navigate("/adminproducts");
    } catch (error) {
      setError("Error updating product");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block font-medium">Product Name</label>
            <input
              type="text"
              name="Product_name"
              value={product.Product_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="Description"
              value={product.Description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Product Image 1</label>
            <input type="file" onChange={(e) => handleImageChange(e, "image")} accept="image/*" />
            {preview1 && <img src={preview1} alt="Preview" className="mt-2 w-24 h-24 object-cover" />}
          </div>

          <div>
            <label className="block font-medium">Product Image 2</label>
            <input type="file" onChange={(e) => handleImageChange(e, "image2")} accept="image/*" />
            {preview2 && <img src={preview2} alt="Preview" className="mt-2 w-24 h-24 object-cover" />}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update Product
          </button>
        </form>
        <button
          onClick={() => navigate("/admin-products")}
          className="w-full mt-4 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
