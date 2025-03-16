const adminCheck = (req, res, next) => {
    console.log("Checking admin access for email:", req.email);  // Debugging

    if (req.email === 'Admin@gmail.com') {
        console.log("Admin access granted");
        next();
    } else {
        console.log("Admin access denied for:", req.email);  // Debugging
        res.status(403).json({ msg: "You are not allowed" });
    }
};

export { adminCheck };
