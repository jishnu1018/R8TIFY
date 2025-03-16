import { Router } from "express";
import { authenticate } from "../Middleware/authenticate.js";
import { Review } from "../Model/sample1.js";
// import { user } from "./userauth.js";
import { PROduct } from "../Model/Admin/add.js";
//import { PROFILE } from "../Model/profile.js";
import { usercheck } from "../Middleware/usercheck.js";
import { upload } from "../Middleware/Multer.js";
import { USER } from "../Model/profile.js";


const review=Router();
const ConvertToBase64=(buffer)=>{
    return buffer.toString("base64");
}

//Adding a review  
review.post(
  "/review",
  authenticate,
  upload.fields([
    { name: "reviewimage1", maxCount: 1 },
    { name: "reviewimage2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { Name, Star, Title, About } = req.body;
      const sameproduct = await PROduct.findOne({ Product_name: Name });

      if (!sameproduct) return res.status(404).send("Product not found");

      let imagebase64_1 = req.files?.reviewimage1?.[0]?.buffer ? ConvertToBase64(req.files.reviewimage1[0].buffer) : null;
      let imagebase64_2 = req.files?.reviewimage2?.[0]?.buffer ? ConvertToBase64(req.files.reviewimage2[0].buffer) : null;

      const newReview = new Review({
        productId: sameproduct._id,
        userId: req.user.id,
        star: parseInt(Star, 10),
        title: Title,
        about: About,
        image: imagebase64_1,
        image2: imagebase64_2,
      });

      await newReview.save();
      
      await PROduct.findByIdAndUpdate(
        sameproduct._id,
        { $push: { reviews: newReview._id } },
        { new: true }
      );

      res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
);


// ✅ Get product reviews - Fixed endpoint & response
  review.get("/review/product",authenticate, async (req, res) => {
    try {
      const productName = req.query.name?.trim();
      if (!productName) return res.status(400).json({ message: "Product name is required" });

      const prod = await PROduct.findOne({ Product_name: { $regex: new RegExp(productName, "i") } });
      if (!prod) return res.status(404).json({ message: "Product not found" });

      const reviews = await Review.find({ productId: prod._id }).populate("userId", "name image").exec();

      res.status(200).json({
        product: {
          id: prod._id,
          name: prod.Product_name,
          description: prod.Product_description,
          price: prod.price,
          images: [prod.image, prod.image2].filter(Boolean),
        },
        reviews: reviews.map((rev) => ({
          username: rev.userId?.name || "Anonymous",
          profilePic: rev.userId?.image || "/default-profile.png",
          rating: rev.star,
          title: rev.title || "No Title", // ✅ Add this line
          comment: rev.about,
          images: [rev.image, rev.image2].filter(Boolean),
        })),
      });
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });








//Update the review
review.put("/reviews/:id",authenticate, upload.fields([{ name: "image" }, { name: "image2" }]), async (req, res) => {
  try {
    const { title, about, description } = req.body;

    const updatedReview = {
      title,
      about,
      description,
      ...(req.files.image && { image: req.files.image[0].buffer.toString("base64") }),
      ...(req.files.image2 && { image2: req.files.image2[0].buffer.toString("base64") }),
    };

    const review = await Review.findByIdAndUpdate(req.params.id, updatedReview, { new: true });
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error" });
  }
});


review.get("/reviews/:id", authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Convert images to Base64 format
    const formattedReview = {
      ...review._doc,
      image: review.image ? `data:image/jpeg;base64,${review.image}` : null,
      image2: review.image2 ? `data:image/jpeg;base64,${review.image2}` : null,
    };

    res.json(formattedReview);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error" });
  }
});






//Get the Product



review.get("/product", authenticate, async (req, res) => {
  try {
    const productName = req.query.name?.trim(); // Trim whitespace

    if (!productName) {
      return res.status(400).json({ message: "Product name is required" });
    }

    // Change from `findOne` to `find` to support multiple matching products
    const products = await PROduct.find({
      name: { $regex: new RegExp(productName, "i") }  // Use correct field name
    });
    

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found for '${productName}'` });
    }

    // Use the first matching product to fetch reviews
    const prod = products[0];

    // Fetch reviews using the product's _id
    const reviews = await Review.find({ productId: prod._id }).populate("userId", "username profilePic");

    console.log(`Found ${reviews.length} reviews for product: ${productName}`);

    // Clean up images (remove null values)
    const images = [prod.image, prod.image2].filter(Boolean);

    // Format response
    const response = {
      product: {
        Product_name: prod.Product_name,
        Product_description: prod.Product_description,
        price: prod.price,
        category: prod.category,
        images: images, // Avoid sending null values
      },
      reviews: reviews.map((rev) => ({
        username: rev.userId.username,
        profilePic: rev.userId.profilePic || "/default-profile.png",
        rating: rev.rating,
        comment: rev.comment,
        likes: rev.likes || 0,
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});


review.get("/categoryproduct",authenticate, async (req, res) => {
  try {
    const products = await PROduct.find(); // Fetch all products
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




//Upadte profile

review.get("/getUserProfile",authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets req.user
    const user = await USER.findById(userId).select("-password"); // Exclude password

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      name: user.name,
      phn_no: user.phn_no,
      description: user.description || "",
      profilephoto: user.profilephoto || "",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update user profile
review.put("/profileupdate",authenticate, upload.single("updatephoto"), async (req, res) => {
  try {
    const { email, NAME, PHN } = req.body;  // Accept email from frontend

    if (!email || !NAME || !PHN) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedUser = await USER.findOneAndUpdate({ email }, {
      name: NAME,
      phn_no: PHN,
      profilephoto: req.file ? `/uploads/${req.file.filename}` : undefined,
    }, { new: true });

    res.json({ message: "Profile updated successfully", profilephoto: updatedUser.profilephoto });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//getting only the user made reviews
review.get("/userreviews", authenticate, async (req, res) => {
  try {
    console.log("Authenticated User:", req.user);

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch user reviews and populate productId and userId
    const reviews = await Review.find({ userId: req.user.id })
      .populate("userId", "name image")
      .populate("productId", "Product_name") // Use Product_name instead of name
      .lean();

    console.log("Fetched Reviews:", reviews);

    // Convert image buffers to Base64
    const reviewsWithBase64 = reviews.map((review) => ({
      ...review,
      image: review.image
        ? `data:image/jpeg;base64,${
            Buffer.isBuffer(review.image) ? review.image.toString("base64") : review.image
          }`
        : null,
      image2: review.image2
        ? `data:image/jpeg;base64,${
            Buffer.isBuffer(review.image2) ? review.image2.toString("base64") : review.image2
          }`
        : null,
      user: {
        name: review.userId?.name || "Anonymous",
        profilephoto: review.userId?.image || "/default-profile.png",
      },
      productName: review.productId?.Product_name || "Unknown Product", // Use Product_name
    }));

    res.json(reviewsWithBase64);
  } catch (error) {
    console.error("Error fetching user-specific reviews:", error);
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
});





review.delete("/reviews/:id",authenticate, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
});


review.get("/randomproducts",authenticate, async (req, res) => {
  try {
    const products = await PROduct.aggregate([{ $sample: { size: 3 } }]); // Fetch 3 random products
    const reviews = await Review.find().populate("userId", "name image").lean(); // Fetch all reviews

    const productReviews = products.map((product) => {
      const relatedReviews = reviews.filter(
        (review) => review.productId.toString() === product._id.toString()
      );

      return {
        id: product._id,
        name: product.Product_name,
        description: product.Product_description,
        price: product.price,
        category: product.category,
        images: [product.image, product.image2].filter(Boolean),
        reviews: relatedReviews.map((rev) => ({
          username: rev.userId?.name || "Anonymous",
          profilePic: rev.userId?.image || "/default-profile.png",
          rating: rev.star,
          title:rev.title,
          comment: rev.about,
          images: [rev.image, rev.image2].filter(Boolean),
        })),
      };
    });

    res.status(200).json({ products: productReviews });
  } catch (error) {
    console.error("Error fetching random products and reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Logout
review.get("/logout", (req, res) => {
  res.clearCookie("cookietoken");
  res.status(200).send("logout");
  console.log("logout");
});

export { review };


// review.delete('/reviews/:id', async (req, res) => {
//   try {
//     const review = await Review.findByIdAndDelete(req.params.id);
    
//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     res.json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting review:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });




// //logout
// review.get('/logout',(req,res)=>{
//     res.clearCookie('cookietoken');
//     res.status(200).send("logout")
//     console.log("logout");
    
// })

// export {review}














// review.post(
//   "/review",
//   authenticate,
//   upload.fields([
//     { name: "reviewimage1", maxCount: 1 },
//     { name: "reviewimage2", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const { Name, Star, Title, About } = req.body;

//       const sameproduct = await PROduct.findOne({ Product_name: Name });

//       if (!sameproduct) {
//         return res.status(404).send("Product not found");
//       }

//       let imagebase64_1 = null;
//       let imagebase64_2 = null;

//       if (req.files?.reviewimage1) {
//         imagebase64_1 = ConvertToBase64(req.files.reviewimage1[0].buffer);
//       }
//       if (req.files?.reviewimage2) {
//         imagebase64_2 = ConvertToBase64(req.files.reviewimage2[0].buffer);
//       }

//       const newReview = new Review({
//         productId: sameproduct._id,
//         userId: req.user.id,  // ✅ Storing user ID
//         star: parseInt(Star, 10),
//         title: Title,
//         about: About,
//         image: imagebase64_1,
//         image2: imagebase64_2,
//       });
      
//       await newReview.save();
      

//       await newReview.save();

//       res.status(201).json({
//         message: "Review added successfully",
//         review: newReview,
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
//   }
// );


// review.get("/api/review/product", async (req, res) => {
//   try {
//     const productName = req.query.name?.trim();
//     if (!productName) return res.status(400).json({ message: "Product name is required" });

//     const prod = await PROduct.findOne({ Product_name: { $regex: new RegExp(productName, "i") } });
//     if (!prod) return res.status(404).json({ message: "Product not found" });

//     const reviews = await Review.find({ productId: prod._id })
//       .populate("userId", "name image")
//       .exec();

//     res.status(200).json({
//       product: {
//         id: prod._id,
//         name: prod.Product_name,
//         description: prod.Product_description,
//         price: prod.price,
//         images: [prod.image, prod.image2].filter(Boolean),
//       },
//       reviews: reviews.map((rev) => ({
//         username: rev.userId?.name || "Anonymous",
//         profilePic: rev.userId?.image || "/default-profile.png",
//         rating: rev.star,
//         comment: rev.about,
//         images: [rev.image, rev.image2].filter(Boolean), // Include review images
//     })),
    
//     });
//   } catch (error) {
//     console.error("Error fetching product reviews:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// review.get("/userreviews", async (req, res) => {
//   try {
//     const reviews = await Review.find()
//       .populate("userId", "name image") // ✅ Fetch 'image' instead of 'profilephoto'
//       .lean(); // Convert Mongoose documents to plain objects

//     // Convert image buffers to Base64 if needed
//     const reviewsWithBase64 = reviews.map(review => ({
//       ...review,
//       image: review.image ? `data:image/jpeg;base64,${review.image.toString("base64")}` : null,
//       image2: review.image2 ? `data:image/jpeg;base64,${review.image2.toString("base64")}` : null,
//       user: {
//         name: review.userId?.name || "Anonymous",
//         profilephoto: review.userId?.image || "/default-profile.png", // ✅ Use 'image' for user photo
//       },
//     }));

//     res.json(reviewsWithBase64);
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     res.status(500).json({ error: "Failed to fetch reviews" });
//   }
// });
