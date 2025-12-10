import express from 'express';
import mongoose from 'mongoose';

import User from '../models/user.js';
import Product from '../models/product.js';
import Request from '../models/request.js';
import Notification from '../models/notification.js';

const router = express.Router();

// -------------------------------------
// SEND REQUEST
// -------------------------------------
router.post('/sendRequest', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ 
        success: false, 
        notLoggedIn: true 
      });
    }

    const user = await User.findById(req.session.user._id);

    // ---- PROFILE INCOMPLETE CHECK ----
    const requiredFields = [
      "first_name", "last_name", "mobile",
      "block", "wing", "room", "branch", "year"
    ];

    const isEmpty = v => v === "" || v === null || v === undefined;
    const incomplete = requiredFields.some(f => isEmpty(user[f]));

    if (incomplete) {
      return res.status(400).json({
        success: false,
        incompleteProfile: true
      });
    }
    // ----------------------------------

    const { product_id, start_date, end_date, total_amount } = req.body;

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ success:false, message:"Product not found" });

    const newRequest = new Request({
      requester_id: user._id,
      owner_id: product.uploader_id,
      product_id: product._id,
      start_date,
      end_date,
      total_amount,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    });

    const savedRequest = await newRequest.save();

    await Notification.create({
      recipient_id: product.uploader_id,
      sender_id: user._id,
      type: 'request',
      related_request_id: savedRequest._id,
      message: 'You have received a new rental request for your product.',
      is_read: false,
      created_at: new Date()
    });

    res.json({ success: true, message: 'Request sent successfully!' });

  } catch (err) {
    console.error("Send Request Error:", err);
    res.status(500).json({ success: false, message: 'Error creating request.' });
  }
});

// -------------------------------------
// UPDATE REQUEST STATUS
// -------------------------------------

router.patch('/update-request/:requestId', async (req, res) => {

  try {
    const { status, productId } = req.body;
    const { requestId } = req.params;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Update request status
    request.status = status;
    request.updated_at = new Date();
    await request.save();

    // If approved → mark product unavailable
    if (status === 'approved' && productId) {
      await Product.findByIdAndUpdate(productId, { status: 'not available' });
    }

    // Send notification to requester
    await Notification.create({
      recipient_id: request.requester_id,
      sender_id: request.owner_id,
      type: 'response',
      related_request_id: request._id,
      message: `Your request has been ${status}.`,
      is_read: false,
      created_at: new Date()
    });

    res.json({ success: true, message: `Request ${status} successfully` });

  } catch (err) {
    console.error("Update Request Error:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
