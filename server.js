import dotenv from "dotenv";
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import accountRoutes from "./routes/accountroutes.js";
import productRoutes from './routes/products.js';
import requestRoutes from './routes/requests.js';
import notificationRoutes from './routes/notifications.js';
import reviewRoutes from './routes/reviews.js';
import './cron/updateStatuses.js';


import Product from './models/product.js';
import User from './models/user.js';


dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------- VIEW ENGINE --------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// -------------------- CONNECT MONGODB --------------------
await connectDB();


app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// -------------------- MOUNT ROUTES --------------------
app.use('/auth', authRoutes);
app.use("/account", accountRoutes);  
app.use('/products', productRoutes);
app.use('/requests', requestRoutes);
app.use('/notifications', notificationRoutes);
app.use('/reviews', reviewRoutes);

// -------------------- HOME PAGE --------------------
// -------------------- HOME PAGE --------------------
app.get('/', async (req, res) => {
  try {
    const filter = { status: "available" };

    // If user is logged in, hide their own products
    if (req.session.user) {
      filter.uploader_id = { $ne: req.session.user._id };
    }

    const products = await Product.find(filter)
      .populate('uploader_id')
      .exec();

    res.render('index', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// -------------------- HELPERS --------------------
const renderRatings = (ratings) => {
  if (!ratings || ratings.length === 0) return "No ratings available";

  const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  return `Rating: ${avg.toFixed(1)} / 5`;
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};



// -------------------- CATEGORY ROUTES --------------------
app.get('/category/:name', async (req, res) => {
  try {
    const category = req.params.name.replace(/_/g, " ");

    // Base filter
    const filter = {
      product_name: { $regex: category, $options: "i" },
      status: { $in: ["available", "pending"] }  // ⬅️ Show both statuses
    };

    // Hide logged-in user’s own products
    if (req.session.user) {
      filter.uploader_id = { $ne: req.session.user._id };
    }

    const products = await Product.find(filter)
      .populate('uploader_id');

    res.render("query", { products, renderRatings, formatDate });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching category products");
  }
});


const checkProfileComplete = async (req, res, next) => {
  
    if (!req.session.user) return res.redirect("/");

    const user = await User.findById(req.session.user._id);

    const requiredFields = [
        "first_name", "last_name", "mobile",
        "block", "wing", "room", "branch", "year"
    ];

    const isEmpty = v => v === "" || v === null || v === undefined;

    const incomplete = requiredFields.some(f => isEmpty(user[f]));

    
    if (incomplete) return res.redirect("/account?incomplete=1");


    next();
};




// -------------------- MY PRODUCTS PAGE --------------------
app.get('/myProducts', async (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const products = await Product.find({ uploader_id: req.session.user._id });
  res.render('myProducts', { products });
});

// -------------------- NOTIFICATIONS PAGE --------------------
app.get('/notifications', async (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const notifications = await db.collection('notifications')
    .find({ userId: req.session.user._id })
    .sort({ createdAt: -1 })
    .toArray();

  res.render('notifications', { notifications });
});

// -------------------- PRODUCT UPLOAD PAGE --------------------
app.get('/product_up', checkProfileComplete, (req, res) => {
    res.render('product_up');
});


// -------------------- LOGOUT --------------------
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);




app.get("/search", async (req, res) => {
    try {
        const searchQuery = req.query.query || "";
        

        // Base filter
        const filter = {
            product_name: { $regex: searchQuery, $options: "i" },
            status: { $in: ["available"] } // ⬅️ Show both
        };

        // Hide products uploaded by the logged-in user
        if (req.session.user) {
            filter.uploader_id = { $ne: req.session.user._id };
        }

        const products = await Product.find(filter)
            .populate("uploader_id");

        res.render("query", { products, renderRatings, formatDate });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error while fetching products.");
    }
});
