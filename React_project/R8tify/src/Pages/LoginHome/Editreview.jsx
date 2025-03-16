import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState({ title: '', about: '', description: '', image: '', image2: '' });
  const [newImages, setNewImages] = useState({ image: null, image2: null });

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:9001/reviews/${id}`, { credentials: 'include' });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setReview(data);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };
  
    fetchReview();
  }, [id]);

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages({ ...newImages, [e.target.name]: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', review.title);
    formData.append('about', review.about);
    formData.append('description', review.description);
    if (newImages.image) formData.append('image', newImages.image);
    if (newImages.image2) formData.append('image2', newImages.image2);
  
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
  
      if (!response.ok) throw new Error('Failed to update review');
  
      alert('Review updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete review');

      alert('Review deleted successfully!');
      navigate('/profile');
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Review</h1>
      <form onSubmit={handleUpdate} className="bg-white p-6 shadow-lg rounded-lg w-[90%] sm:w-[500px]">
        <label className="block mb-2 font-semibold">Title</label>
        <input type="text" name="title" value={review.title} onChange={handleChange} className="border p-2 w-full rounded" />

        <label className="block mt-4 mb-2 font-semibold">About</label>
        <input type="text" name="about" value={review.about} onChange={handleChange} className="border p-2 w-full rounded" />

        <label className="block mt-4 mb-2 font-semibold">Update Image 1</label>
        <input type="file" name="image" onChange={handleImageChange} className="border p-2 w-full rounded" />
        {review.image && <img src={review.image} alt="Current Image 1" className="mt-2 w-full h-auto" />}

        <label className="block mt-4 mb-2 font-semibold">Update Image 2</label>
        <input type="file" name="image2" onChange={handleImageChange} className="border p-2 w-full rounded" />
        {review.image2 && <img src={review.image2} alt="Current Image 2" className="mt-2 w-full h-auto" />}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Update Review</button>
      </form>

      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Delete Review</button>
    </div>
  );
};

export default EditReview;
