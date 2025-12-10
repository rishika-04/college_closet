import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// ===== Import Models =====
import User from "./models/user.js";
import Product from "./models/product.js";
import Request from "./models/request.js";
import Notification from "./models/notification.js";

// ===== MongoDB Connection =====
const MONGO_URI = process.env.MONGODB_URI;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");
        // ---------------------------------
        // CLEAR EXISTING DATA
        // ---------------------------------
        await User.deleteMany({});
        await Product.deleteMany({});
        await Request.deleteMany({});
        await Notification.deleteMany({});
        console.log("Old data cleared.");

        const passwordHash = await bcrypt.hash("Password@123", 10);

        // ---------------------------------
        // USERS
        // ---------------------------------
        const users = await User.insertMany([
            {
                first_name: "Prakrati",
                last_name: "Sharma",
                mobile: 9123456789,
                email: "prakrati.23bce11841@vitbhopal.ac.in",
                password: passwordHash,
                block: "1",
                wing: "A",
                room: 101,
                branch: "CSE",
                year: 2
            },
            {
                first_name: "Niharika",
                last_name: "Verma",
                mobile: 9876543210,
                email: "niharika.23bcg10061@vitbhopal.ac.in",
                password: passwordHash,
                block: "2",
                wing: "B",
                room: 203,
                branch: "BCG",
                year: 2
            },
            {
                first_name: "Rishika",
                last_name: "Thakur",
                mobile: 8877665544,
                email: "rishika.23bce10009@vitbhopal.ac.in",
                password: passwordHash,
                block: "3",
                wing: "C",
                room: 305,
                branch: "CSE",
                year: 2
            }
        ]);

        const [prakrati, niharika, rishika] = users;

        console.log("Users created.");

        // ---------------------------------
        // PRODUCTS (UPDATED)
        // ---------------------------------
        // Fix image extensions



        const productsData = [
    // -------- Stationery ----------
    {
        uploader_id: niharika._id,
        category: "Stationery",
        product_name: "Scientific Calculator",
        model_name: "Casio FX-991ES Plus",
        image_url: "/upload/seed/calculator1.png",
        price: 70,
        age_in_years: 1,
        description: "A well-maintained Casio FX-991ES Plus scientific calculator, perfect for engineering and math courses."
    },
    {
        uploader_id: niharika._id,
        category: "Stationery",
        product_name: "Scientific Calculator",
        model_name: "Casio FX-991MS",
        image_url: "/upload/seed/calculator2.png",
        price: 60,
        age_in_years: 2,
        description: "Casio FX-991MS calculator in good condition, suitable for all academic calculations."
    },
    {
        uploader_id: rishika._id,
        category: "Stationery",
        product_name: "Scientific Calculator",
        model_name: "Casio FX-82MS",
        image_url: "/upload/seed/calculator1.png",
        price: 50,
        age_in_years: 3,
        description: "Casio FX-82MS calculator, slightly older but fully working and reliable."
    },
    {
        uploader_id: rishika._id,
        category: "Stationery",
        product_name: "Notebook",
        model_name: "Classmate 200 Pages",
        image_url: "/upload/seed/notebook.jpg",
        price: 20,
        age_in_years: 1,
        description: "200-page Classmate notebook, clean pages and ideal for semester-long note-taking."
    },
    {
        uploader_id: prakrati._id,
        category: "Stationery",
        product_name: "Technical Drawing Sets",
        model_name: "ProLine Drafting Kit 200",
        image_url: "/upload/seed/drawing_set.png",
        price: 120,
        age_in_years: 2,
        description: "High-quality ProLine drafting kit with essential tools for drawing and design subjects."
    },
    {
        uploader_id: niharika._id,
        category: "Stationery",
        product_name: "Drafting Pens",
        model_name: "Rotring Isograph Set",
        image_url: "/upload/seed/drafting_pens.png",
        price: 80,
        age_in_years: 1,
        description: "Rotring Isograph drafting pens with smooth ink flow, ideal for architecture and design work."
    },

    // -------- Lab Essentials --------
    {
        uploader_id: prakrati._id,
        category: "Lab Essentials",
        product_name: "Lab Coats",
        model_name: "White Coat Medium",
        image_url: "/upload/seed/lab_coat.png",
        price: 50,
        age_in_years: 1,
        description: "Medium-size white lab coat in excellent condition, suitable for all lab sessions."
    },
    {
        uploader_id: niharika._id,
        category: "Lab Essentials",
        product_name: "Lab Glasses",
        model_name: "3M Protective Glasses",
        image_url: "/upload/seed/lab_glasses.png",
        price: 30,
        age_in_years: 2,
        description: "Durable 3M protective glasses offering clear vision and safe lab usage."
    },
    {
        uploader_id: rishika._id,
        category: "Lab Essentials",
        product_name: "Laser Distance Meter",
        model_name: "Bosch GLM 40",
        image_url: "/upload/seed/laser_meter.png",
        price: 150,
        age_in_years: 3,
        description: "Bosch GLM 40 laser distance meter, accurate and reliable for engineering measurements."
    },

    // -------- Notes --------
    {
        uploader_id: rishika._id,
        category: "Notes",
        product_name: "Handwritten Notes",
        model_name: "Engineering Math Sem-2",
        image_url: "/upload/seed/notes_handwritten.webp",
        price: 40,
        age_in_years: 1,
        description: "Clean and well-organized handwritten Engineering Math (Sem-2) notes."
    },
    {
        uploader_id: niharika._id,
        category: "Notes",
        product_name: "Softcopy Notes",
        model_name: "DBMS Full Module",
        image_url: "/upload/seed/notes_softcopy.png",
        price: 25,
        age_in_years: 2,
        description: "Complete DBMS module notes in softcopy, covering all units in simplified form."
    },
    {
        uploader_id: prakrati._id,
        category: "Notes",
        product_name: "Architectural History Summaries",
        model_name: "Modern Architecture Summary",
        image_url: "/upload/seed/architect_history.jpg",
        price: 35,
        age_in_years: 1,
        description: "Concise and easy-to-understand summaries of modern architectural history."
    },
    {
        uploader_id: rishika._id,
        category: "Notes",
        product_name: "Reusable CAD Files / Templates",
        model_name: "AutoCAD Templates Pack",
        image_url: "/upload/seed/cad_templates.webp",
        price: 50,
        age_in_years: 2,
        description: "Pack of reusable AutoCAD templates and CAD resources useful for design projects."
    },

    // -------- Fashion --------
    {
        uploader_id: niharika._id,
        category: "Fashion",
        product_name: "Formal Suits",
        model_name: "Black Formal Blazer Set",
        image_url: "/upload/seed/formal_suit.png",
        price: 100,
        age_in_years: 1,
        description: "Elegant black formal blazer set, perfect for presentations and events."
    },
    {
        uploader_id: prakrati._id,
        category: "Fashion",
        product_name: "High Visibility Jackets",
        model_name: "Reflective Safety Jacket",
        image_url: "/upload/seed/hi_vis_jacket.png",
        price: 40,
        age_in_years: 2,
        description: "Reflective safety jacket suitable for outdoor labs and fieldwork."
    },
    {
        uploader_id: rishika._id,
        category: "Fashion",
        product_name: "Traditional Attire",
        model_name: "Blue Kurti Set",
        image_url: "/upload/seed/traditional_attire.png",
        price: 80,
        age_in_years: 3,
        description: "Beautiful blue kurti set in great condition, ideal for festive occasions."
    },

    // -------- Furniture --------
    {
        uploader_id: prakrati._id,
        category: "Furniture",
        product_name: "Adjustable Drafting Tables",
        model_name: "Artline Foldable Table",
        image_url: "/upload/seed/drafting_table.png",
        price: 200,
        age_in_years: 3,
        description: "Sturdy Artline foldable drafting table, height adjustable and perfect for design work."
    },
    {
        uploader_id: rishika._id,
        category: "Furniture",
        product_name: "Compact Study Desks",
        model_name: "IKEA Compact Desk",
        image_url: "/upload/seed/study_desk.png",
        price: 150,
        age_in_years: 1,
        description: "Minimal and space-efficient IKEA study desk suitable for hostel rooms."
    },
    {
        uploader_id: niharika._id,
        category: "Furniture",
        product_name: "Ergonomic Chairs",
        model_name: "Ergo Comfort Chair",
        image_url: "/upload/seed/ergonomic_chair.png",
        price: 180,
        age_in_years: 2,
        description: "Comfortable ergonomic chair designed to support long study hours."
    },

    // -------- Others --------
    {
        uploader_id: rishika._id,
        category: "Others",
        product_name: "3D Printers",
        model_name: "Ender 3 Pro",
        image_url: "/upload/seed/printer_3d.png",
        price: 250,
        age_in_years: 2,
        description: "Ender 3 Pro 3D printer, well-maintained, ideal for prototypes and projects."
    },
    {
        uploader_id: niharika._id,
        category: "Others",
        product_name: "Bicycles",
        model_name: "Hero Sprint",
        image_url: "/upload/seed/bicycle.png",
        price: 300,
        age_in_years: 3,
        description: "Hero Sprint bicycle in good condition for daily campus commutes."
    },
    {
        uploader_id: prakrati._id,
        category: "Others",
        product_name: "Electronics",
        model_name: "Portable Speaker",
        image_url: "/upload/seed/electronics_item.png",
        price: 70,
        age_in_years: 1,
        description: "Portable Bluetooth speaker with clear sound and long battery life."
    }
];

        const products = await Product.insertMany(productsData);

        console.log("Products created.");

        // ---------------------------------
        // REQUESTS
        // ---------------------------------
        const sciCalc = products.find(p => p.product_name === "Scientific Calculator");
        const notebook = products.find(p => p.product_name === "Notebook");

        const request1 = await Request.create({
            product_id: sciCalc._id,
            requester_id: prakrati._id,
            owner_id: niharika._id,
            start_date: new Date(),
            end_date: new Date(Date.now() + 5 * 24 * 60 *

60 * 1000),
            total_amount: 70,
            status: "approved"
        });

        const request2 = await Request.create({
            product_id: notebook._id,
            requester_id: niharika._id,
            owner_id: rishika._id,
            start_date: new Date(),
            end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            total_amount: 20,
            status: "pending"
        });

        console.log("Requests created.");

        // ---------------------------------
        // NOTIFICATIONS
        // ---------------------------------

        await Notification.create({
            recipient_id: niharika._id,
            sender_id: prakrati._id,
            type: "request",
            related_request_id: request1._id,
            related_product_id: sciCalc._id,
            message: "Prakrati has requested your Scientific Calculator."
        });

        await Notification.create({
            recipient_id: prakrati._id,
            sender_id: niharika._id,
            type: "response",
            related_request_id: request1._id,
            related_product_id: sciCalc._id,
            message: "Your request for Scientific Calculator has been approved."
        });

        await Notification.create({
            recipient_id: rishika._id,
            sender_id: niharika._id,
            type: "request",
            related_request_id: request2._id,
            related_product_id: notebook._id,
            message: "Niharika has requested your Notebook."
        });

        console.log("Notifications created.");

        console.log("✔✔✔ Seeding complete.");
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
