import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footerr from "../../components/Footerr";
import LoginNavbar from "../../components/LoginNavbar";

const Addreview = () => {
  const location = useLocation();
  const product = location.state?.product; 

  const [rating, setRating] = useState(0);
  const [TITLE, setTitle] = useState("");
  const [ABOUT, setAbout] = useState("");
  const [IMAGES, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleRating = (value) => setRating(value);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!TITLE || !ABOUT || rating === 0) {
      alert("Please fill all required fields and select a rating.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Star", rating);
      formData.append("Title", TITLE);
      formData.append("About", ABOUT);
      formData.append("Name", product?.Product_name);

      IMAGES.forEach((image, index) => {
        formData.append(`reviewimage${index + 1}`, image);
      });

      const res = await fetch("/api/review", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error adding review");
      }

      alert("Review added successfully!");

      setRating(0);
      setTitle("");
      setAbout("");
      setImages([]);
    } catch (error) {
      console.error(error);
      alert("Internal Server Error");
    } finally {
      setLoading(false);
    }
    navigate('/home')
  };

  return (
    <>
      <LoginNavbar />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="w-full max-w-3xl mx-auto border border-black p-6 mt-10 bg-gray-100 rounded-lg">
          <p className="text-3xl text-center">What is your review about?</p>

          {product ? (
            <div className="w-full flex items-center border border-black mt-4 p-4 bg-white rounded-lg">
              <img
                className="h-44 w-44 object-cover rounded-md"
                src={
                  product.image?.startsWith("data:image")
                    ? product.image
                    : `data:image/jpeg;base64,${product.image}`
                }
                alt={product.Product_name}
                onError={(e) => (e.target.src = "/default-image.png")}
              />
              <div className="ml-6">
                <p className="text-3xl font-bold">{product.Product_name}</p>
                <p className="text-gray-600">{product.Product_description}</p>
                <p className="text-xl font-bold">RS: {product.price}</p>

                <p className="text-yellow-500 font-semibold flex items-center">
                  ⭐ {product.rating}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-red-500 mt-4">
              No product details available.
            </p>
          )}

          <p className="text-2xl mt-4">Rate the performance</p>
          <div id="starRating" className="flex space-x-1 text-gray-300">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRating(value)}
                className={`text-5xl cursor-pointer ${
                  value <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                &#9733;
              </button>
            ))}
          </div>

          <p className="text-2xl mt-4">Write your experience</p>
          <input
            className="w-full h-12 border-2 border-gray-300 rounded-xl pl-4 mt-2"
            type="text"
            value={TITLE}
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            placeholder="Give a Title"
          />
          <textarea
            className="w-full h-40 border-2 border-gray-300 rounded-xl pl-4 pt-3 mt-3"
            name="about"
            value={ABOUT}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write about experience or Performance"
          ></textarea>

          <p className="text-2xl mt-4">Attach files</p>
          <div className="w-full h-36 border border-black mt-3 bg-white rounded-lg flex justify-center items-center cursor-pointer">
            <input
              type="file"
              id="file-input"
              name="reviewImages"
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <label htmlFor="file-input" className="flex flex-col items-center">
              <img
                src="/Image/Add Image free icons designed by nawicon.jpeg"
                alt="Upload"
                className="w-16 h-16"
              />
              <span className="text-2xl">Attach here</span>
            </label>
          </div>

          
          {IMAGES.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {IMAGES.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index}`}
                    className="w-24 h-24 object-cover rounded-lg shadow-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="w-full max-w-3xl mx-auto flex justify-center mt-6">
            <button
              type="submit"
              className="bg-black text-white text-xl font-bold w-80 h-14 rounded-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </form>
      <Footerr />
    </>
  );
};

export default Addreview;
