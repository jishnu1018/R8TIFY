import React, { useEffect, useState } from "react";
import { logo } from "../../assets/Images/Images";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "", image: "" });
  const [reviews, setReviews] = useState([]);
  const [deletedReviews, setDeletedReviews] = useState([]);
  const [showDeletedReviews, setShowDeletedReviews] = useState(false);
  // ===== Added state for review editing =====
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editDescription, setEditDescription] = useState("");
  // ============================================
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await fetch("/api/userreviews", { credentials: "include" });
        const data = await response.json();
        console.log("Fetched Reviews:", data); // Debugging API response
        setReviews(data);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    const fetchDeletedReviews = async () => {
      try {
        const response = await fetch("/api/user-deleted-reviews", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch deleted reviews");
        const data = await response.json();
        console.log("Fetched Deleted Reviews:", data); // Debugging API response
        setDeletedReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching deleted reviews:", error);
      }
    };

    fetchUser();
    fetchUserReviews();
    fetchDeletedReviews();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // ===== Added functions for editing reviews =====
  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditTitle(review.title);
    setEditAbout(review.about);
    setEditDescription(review.description);
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("about", editAbout);
      formData.append("description", editDescription);

      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update review");
      const updatedReview = await response.json();

      setReviews((prevReviews) =>
        prevReviews.map((rev) => (rev._id === reviewId ? updatedReview : rev))
      );
      setEditingReviewId(null);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };
  // ===================================================

  return (
    <div className="text-gray-800">
      <Link to="/home">
        <img src={logo} alt="logo" className="border border-black rounded-full w-24 h-20 mt-2" />
      </Link>

      <div className="flex flex-col items-center text-center p-4">
        <h1 className="text-5xl italic font-serif text-black drop-shadow-[0_0_3px_cyan]">R8TIFY</h1>
      </div>

      <div className="bg-black w-[90%] sm:w-[550px] mx-auto mt-8 p-6 rounded-3xl text-white">
        <p className="text-3xl text-center">Profile</p>
        <div className="flex flex-col sm:flex-row items-center mt-4">
          <img src={user.image || "/default-avatar.jpg"} alt="User Profile" className="w-20 rounded-full border-2" />
          <div className="text-lg mt-4 sm:mt-0 sm:ml-10">
            <p>{user.name || "User Name"}</p>
            <p>{user.email || "No Email Found"}</p>
            <p>{user.phone || ""}</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => navigate("/editprofile")} className="bg-blue-500 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {deletedReviews.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowDeletedReviews(!showDeletedReviews)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {showDeletedReviews ? "Hide Deleted Reviews" : "See Deleted Reviews"}
          </button>
        </div>
      )}

      {showDeletedReviews && (
        <div className="bg-red-100 w-[90%] sm:w-[1000px] mx-auto mt-8 p-6 rounded-3xl">
          <p className="text-red-600 text-3xl text-center font-bold">Deleted Reviews</p>
          <div className="flex flex-col gap-6 mt-4">
            {deletedReviews.map((review, index) => {
              console.log("Deleted Review:", review); // Debugging
              return (
                <div key={index} className="bg-white shadow-md rounded-lg p-4">
                  <p className="text-gray-800 font-semibold">Product: {review.productName || "Unknown Product"}</p>
                  <p className="text-red-600 font-bold">Title: {review.title || "No Title"}</p>
                  <p className="text-red-500 font-semibold">Deleted Reason: {review.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-100 w-[90%] sm:w-[1000px] mx-auto mt-8 p-6 rounded-3xl">
        <p className="text-black text-3xl text-center font-bold">My Reviews</p>
        {reviews.length > 0 ? (
          <div className="flex flex-col gap-6 mt-4">
            {reviews.map((review) => {
              console.log("User Review:", review); // Debugging
              return (
                <div key={review._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex flex-col items-center">
                    <img src={user.image || "/default-avatar.jpg"} alt="User" className="w-12 h-12 rounded-full border" />
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-sm">⭐ {review.star} Rating</p>
                  </div>
                  <div className="flex-1">
                    {/* ===== Added conditional rendering for editing ===== */}
                    {editingReviewId === review._id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border p-2 rounded"
                          placeholder="Edit title"
                        />
                        <textarea
                          value={editAbout}
                          onChange={(e) => setEditAbout(e.target.value)}
                          className="border p-2 rounded"
                          placeholder="Edit about"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="border p-2 rounded"
                          placeholder="Edit description"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(review._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-red-600 font-bold text-lg">{review.title}</p>
                        <p className="text-gray-800 font-semibold">
                          Product: {review.productName || "Unknown Product"}
                        </p>
                        <p className="text-gray-700 font-semibold">{review.about}</p>
                        <p className="text-sm text-gray-500 mt-1">{review.description}</p>
                        <div className="flex space-x-2 mt-2">
                          {review.image && (
                            <img src={review.image} alt="Review" className="w-20 h-20 rounded-lg border" />
                          )}
                          {review.image2 && (
                            <img src={review.image2} alt="Review 2" className="w-20 h-20 rounded-lg border" />
                          )}
                        </div>
                        {/* ===== Added Edit button ===== */}
                        <button
                          onClick={() => handleEditClick(review)}
                          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        >
                          Edit Review
                        </button>
                      </>
                    )}
                    {/* =================================================== */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">No reviews added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
