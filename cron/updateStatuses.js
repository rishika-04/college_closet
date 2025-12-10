import cron from "node-cron";
import Request from "../models/request.js";
import Product from "../models/product.js";

// Runs every minute
cron.schedule("* * * * *", async () => {
  console.log("⏳ Checking expired rental requests...");

  const now = new Date();

  try {
    // 1️⃣ Find all approved (rented) requests whose rental period is over
    const expiredRequests = await Request.find({
      status: "approved",
      end_date: { $lte: now }
    });

    if (expiredRequests.length > 0) {
      console.log(`Found ${expiredRequests.length} expired rentals.`);

      for (const req of expiredRequests) {
        // 2️⃣ Mark the request as completed
        req.status = "completed";
        await req.save();

        // 3️⃣ Make the product available again
        await Product.findByIdAndUpdate(req.product_id, {
          status: "available"
        });
      }

      console.log("✔ Rental statuses updated successfully.");
    }
  } catch (err) {
    console.error("❌ Error updating rental statuses:", err);
  }
});
