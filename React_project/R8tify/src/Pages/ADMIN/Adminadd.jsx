import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Adminadd = () => {
    const [product, setProduct] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(""); 
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [preview1, setPreview1] = useState(null);
    const [preview2, setPreview2] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleImageChange = (e, setImage, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!category) {
            setError("Please select a category.");
            return;
        }

        const formData = new FormData();
        formData.append("Product", product);
        formData.append("Description", description);
        formData.append("Price", price);
        formData.append("Category", category);
        if (image1) formData.append("productimage1", image1);
        if (image2) formData.append("productimage2", image2);

        try {
            const response = await axios.post("/api/productadd", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            alert(response.data.message || "Product added successfully!");
            navigate("/admin");
        } catch (err) {
            setError("Error adding product. Try again.");
            console.error(err);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Add New Product</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleAdd}>
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Product Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 p-3 h-32 w-full border border-gray-300 rounded-md"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md"
                    >
                        <option value="">Select Category</option>
                        <option value="Phones">Phones</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Consoles">Consoles</option>
                        <option value="Cameras">Cameras</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Product Image 1</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setImage1, setPreview1)}
                        className="w-full border border-gray-300 rounded-md mt-1 p-3"
                    />
                    {preview1 && <img src={preview1} alt="Preview 1" className="mt-2 w-32 h-32 object-cover rounded-md" />}
                </div>
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Product Image 2</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setImage2, setPreview2)}
                        className="w-full border border-gray-300 rounded-md mt-1 p-3"
                    />
                    {preview2 && <img src={preview2} alt="Preview 2" className="mt-2 w-32 h-32 object-cover rounded-md" />}
                </div>
                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-blue-500 text-white font-semibold w-40 h-12 rounded-md">
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Adminadd;
