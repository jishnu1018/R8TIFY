import { Router } from "express";
import { adminauthen } from "../Middleware/adminauthen.js";
import { PROduct } from "../Model/Admin/add.js";
import { USER } from "../Model/profile.js";
import { Review } from "../Model/sample1.js";
import { adminCheck } from "../Middleware/admincheck.js";
import { upload } from "../Middleware/Multer.js";
import mongoose from "mongoose";
import { DeletedUser } from "../Model/deleteuser.js";
import {DeletedReview} from "../Model/deletereview.js"
import { authenticate } from "../Middleware/authenticate.js";

const adminadd = Router();

// ✅ Convert Image to Base64
const convertToBase64 = (buffer) => buffer.toString("base64");

// ✅ Add a Product
adminadd.post(
    "/productadd",
    adminauthen,
    adminCheck,
    upload.fields([
      { name: "productimage1", maxCount: 1 },
      { name: "productimage2", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const { Product, Description, Price, Category } = req.body;
  
        if (!Product || !Description || !Price || !Category) {
          return res.status(400).json({ message: "All fields are required" });
        }
  
        const existingProduct = await PROduct.findOne({ Product_name: Product });
  
        if (existingProduct) {
          return res.status(400).json({ message: "Product already exists" });
        }
  
        let proimage1 = null;
        let proimage2 = null;
  
        if (req.files?.productimage1) {
          proimage1 = req.files.productimage1[0].buffer.toString("base64");
        }
        if (req.files?.productimage2) {
          proimage2 = req.files.productimage2[0].buffer.toString("base64");
        }
  
        const newProduct = new PROduct({
          Product_name: Product,
          Product_description: Description,
          price: parseFloat(Price),
          category: Category,
          image: proimage1,
          image2: proimage2,
        });
  
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
      } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
  

// ✅ Update Product
adminadd.put(
    "/adminproducts/:id",
    adminauthen,
    adminCheck,
    upload.fields([
      { name: "productimage1", maxCount: 1 },
      { name: "productimage2", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const { Product_name, Description, Price, Category } = req.body;
  
        let updatedFields = {
          Product_name,
          Product_description: Description,
          price: parseFloat(Price),
          category: Category,
        };
  
        if (req.files?.productimage1) {
          updatedFields.image = req.files.productimage1[0].buffer.toString("base64");
        }
        if (req.files?.productimage2) {
          updatedFields.image2 = req.files.productimage2[0].buffer.toString("base64");
        }
  
        await PROduct.findByIdAndUpdate(req.params.id, updatedFields);
        res.json({ message: "Product updated successfully" });
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
  


adminadd.get("/categories",adminauthen,
  adminCheck, async (req, res) => {
    try {
        const categories = ["Phones", "Laptops", "Consoles", "Cameras"]; // Fixed categories from schema
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// ✅ Get All Products
adminadd.get("/adminproducts",adminauthen,
  adminCheck, async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};

        const products = await PROduct.find(query);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get Single Product
adminadd.get("/adminproducts/:id",adminauthen,
  adminCheck, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await PROduct.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Delete Product
adminadd.delete("/adminproducts/:id",adminauthen,
  adminCheck, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const deletedProduct = await PROduct.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get All Users
adminadd.get("/adminusers",adminauthen,
  adminCheck, async (req, res) => {
    try {
        const users = await USER.find({}, "name email phn_no createdAt");
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Delete User

// adminadd.delete("/api/userdelete/:email", async (req, res) => {
//   const { email } = req.params;
//   const { reason } = req.body;

//   if (!reason) {
//       return res.status(400).json({ error: "Deletion reason is required." });
//   }

//   try {
//       const user = await USER.findOne({ email });
//       if (!user) {
//           return res.status(404).json({ error: "User not found." });
//       }

//       // Save deletion reason before deleting user
//       await DeletedUser.create({ email, reason });

//       // Delete user from users collection
//       await USER.findOneAndDelete({ email });

//       res.json({ message: "User deleted successfully. Reason saved." });
//   } catch (error) {
//       res.status(500).json({ error: "Internal server error." });
//   }
// });


// ✅ Delete User
adminadd.delete("/userdelete/:email", adminauthen, adminCheck, async (req, res) => {
  const { email } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: "Deletion reason is required." });
  }

  try {
    console.log(`Deleting user: ${email}`);

    const user = await USER.findOne({ email });
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found." });
    }

    // Save deletion reason
    await DeletedUser.create({ email, reason });

    // Delete user's reviews
    const deletedReviews = await Review.deleteMany({ userId: user._id });
    console.log(`Deleted reviews: ${deletedReviews.deletedCount}`);

    // Delete user
    await USER.deleteOne({ _id: user._id });

    console.log("User deleted successfully");
    res.json({ message: "User and associated reviews deleted successfully. Reason saved." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});



// ✅ Get User Stats
adminadd.get("/userstats",adminauthen,
  adminCheck, async (req, res) => {
    try {
        const totalUsers = await USER.countDocuments();
        const totalProducts = await PROduct.countDocuments();

        res.json({ totalUsers, totalProducts });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get Recent Users
adminadd.get("/recentusers",adminauthen,
  adminCheck, async (req, res) => {
    try {
        const users = await USER.find({}, "name email createdAt")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json(users);
    } catch (error) {
        console.error("Error fetching recent users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//allreviews
adminadd.get("/product/:productId/reviews", adminauthen, adminCheck, async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId format" });
    }

    // Fetch product and populate its reviews
    const product = await PROduct.findById(productId)
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "name image" }, // Fetch user details
      });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ message: "Failed to fetch product reviews" });
  }
});


// adminadd.get("/allreviews", adminauthen, adminCheck, async (req, res) => {
//   try {
//     const productsWithReviews = await PROduct.find()
//       .populate({
//         path: "reviews",
//         populate: { path: "userId", select: "name image" }, // Fetch user details
//       })
//       .select("Product_name image image2 reviews");

//     res.json(productsWithReviews);
//   } catch (error) {
//     console.error("Error fetching products with reviews:", error);
//     res.status(500).json({ message: "Failed to fetch reviews" });
//   }
// });


//delreview
adminadd.delete("/delreviews/:id", adminauthen, adminCheck, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Also remove the review reference from the related product
    await PROduct.updateOne(
      { _id: deletedReview.productId },
      { $pull: { reviews: reviewId } }
    );

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
});



adminadd.get("/user-deleted-reviews", authenticate, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    // Fetch deleted reviews and populate productId with Product_name
    const deletedReviews = await DeletedReview.find({ userId: req.user.id })
    .populate("productId", "Product_name") // ✅ Fetch product name correctly
    .select("reviewId title reason star about images deletedAt productId");
  
  const response = deletedReviews.map((review) => ({
    ...review.toObject(),
    productName: review.productId?.Product_name || "Unknown Product", // ✅ Now works correctly!
  }));
  
  res.json(response);
  
  } catch (error) {
    console.error("Error fetching deleted reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





//reviewdltt
adminadd.delete('/review/reviews/:id', adminauthen, adminCheck, async (req, res) => {
  try {
      const { id } = req.params;
      const { reason, adminId } = req.body;

      console.log("Received DELETE request for review ID:", id);
      console.log("Received reason:", reason);
      console.log("Admin ID:", adminId);

      const review = await Review.findById(id).populate('productId', 'Product_name');
      if (!review) {
          console.log("Review not found in database!");
          return res.status(404).json({ message: 'Review not found' });
      }

      console.log("Found review, proceeding to delete...");

      const deletedReview = new DeletedReview({
          reviewId: id,
          productId: review.productId,  // ✅ Store the productId, not productName
          userId: review.userId,
          title: review.title,
          reason: reason,
          star: review.star,
          about: review.about,
          deletedAt: new Date(),
      });

      await deletedReview.save();
      await Review.findByIdAndDelete(id);
      await USER.findByIdAndUpdate(review.userId, {
          $push: { notifications: `Your review for "${review.productId?.Product_name || 'Unknown Product'}" was deleted: ${reason}` }
      });

      console.log(`Review deleted by admin: ${adminId}`);
      res.status(200).json({ message: 'Review deleted successfully' });

  } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: 'Error deleting review', error });
  }
});






//produy=ysss
adminadd.get("/products", adminauthen, adminCheck, async (req, res) => {
  try {
    const products = await PROduct.find()
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "name image" }, // Also populating user details
      })
      .exec();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


//fetch 
adminadd.get("/api/user-profile", async (req, res) => {
  try {
    const user = await USER.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    const deletedReviews = await DeletedReview.find({ userId: req.user.id });

    res.json({ ...user.toObject(), deletedReviews });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



// adminadd.get("/products", adminauthen, adminCheck, async (req, res) => {
//   try {
//     console.log("Request received at /products", req.headers);
//     const products = await PROduct.find()
//       .populate({
//         path: "reviews",
//         populate: { path: "userId", select: "name image" },
//       })
//       .exec();

//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });




// ✅ Logout Admin
adminadd.get("/adminlogout", (req, res) => {
    res.clearCookie("cookietoken");
    res.status(200).json({ message: "Admin logged out" });
});

export { adminadd };
