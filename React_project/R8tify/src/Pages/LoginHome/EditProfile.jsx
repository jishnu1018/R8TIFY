import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [phoneError, setPhoneError] = useState(""); // New state for phone number error

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user-profile", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile({
          name: data.name,
          phone: data.phone || "",
          image: data.image,
        });
        setLoading(false);
      } catch (error) {
        setError("Error fetching profile details");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number validation: Only allow 10-digit numbers
    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value)) {
        setPhoneError("Phone number must be exactly 10 digits");
        return;
      } else {
        setPhoneError(""); // Clear error if input is valid
      }
    }

    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final check before submitting
    if (profile.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone", profile.phone);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("/api/profileupdate", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      setError("Error updating profile");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center text-center p-4">
      <h1 className="text-6xl italic font-serif text-black drop-shadow-lg">R8TIFY</h1>

      <div className="bg-black w-[527px] h-[550px] rounded-[57px] mt-5 p-8">
        <form onSubmit={handleSubmit}>
          <p className="text-white text-3xl font-serif text-center">Edit Profile</p>

          <div className="bg-gray-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center mt-4">
            <input type="file" id="file-input" accept="image/*" onChange={handleImageChange} className="hidden" />
            <label htmlFor="file-input" className="cursor-pointer flex">
              <img
                src={image ? URL.createObjectURL(image) : profile.image || "/default-avatar.jpg"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-gray-300"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="text-white text-xl font-light">Name:</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-[400px] h-10 mt-1 ml-4 rounded-lg p-2 bg-white" required />
          </div>

          <div className="mt-6">
            <label className="text-white text-xl font-light">Phone:</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-[400px] h-10 mt-1 ml-4 rounded-lg p-2 bg-white"
              required
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>} {/* Display phone number error */}
          </div>

          <button type="submit" className="w-[150px] h-[50px] mt-6 ml-[160px] rounded-full border-2 border-black bg-white text-black font-bold cursor-pointer">
            Submit
          </button>
        </form>
      </div>

      <p className="text-4xl mt-10 text-center font-itim">
        "Good reviews bring products to life, making them shine <br /> and transforming choices into confident decisions with trusted insights."
      </p>
    </div>
  );
};

export default EditProfile;
