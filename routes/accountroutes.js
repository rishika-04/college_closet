import express from "express";
import User from "../models/user.js";

const router = express.Router();

// LOGIN CHECK MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect("/auth/login");
}

// GET account page
router.get("/", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.session.user._id);

    res.render("account", {
        firstName: user.first_name,
        lastName: user.last_name,
        mobile: user.mobile,
        block: user.block,
        wing: user.wing,
        room: user.room,
        branch: user.branch,
        year: user.year,
        email: user.email
    });
});

// POST update account
router.post("/update-account", isLoggedIn, async (req, res) => {
    await User.findByIdAndUpdate(req.session.user._id, req.body);
    return res.redirect("/");  
});

export default router;
