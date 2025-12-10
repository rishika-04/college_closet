import express from 'express';
import User from '../models/user.js';
import Notification from '../models/notification.js';
import Request from '../models/request.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');

    const userEmail = req.session.user.email;

    // Get logged-in user from DB
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).send('User not found');

    const recipientId = user._id;

    // Aggregate Notifications
    const notifications = await Notification.aggregate([
      { $match: { recipient_id: new mongoose.Types.ObjectId(recipientId) }},

      {
        $lookup: {
          from: 'users',
          localField: 'sender_id',
          foreignField: '_id',
          as: 'sender_info'
        }
      },
      { $unwind: { path: '$sender_info', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'requests',
          localField: 'related_request_id',
          foreignField: '_id',
          as: 'request_info'
        }
      },
      { $unwind: { path: '$request_info', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'products',
          localField: 'request_info.product_id',
          foreignField: '_id',
          as: 'product_info'
        }
      },
      { $unwind: { path: '$product_info', preserveNullAndEmptyArrays: true } },

      { $sort: { created_at: -1 }}
    ]);

    // Transform output
    const transformed = notifications.map(n => ({
      _id: n._id,
      imageUrl: n.product_info?.image_url || '/images/default_pff.jpg',
      name: n.product_info?.product_name || 'No Product Name',
      details: n.request_info?.details || 'No Details',
      rentedStartDate: n.request_info?.start_date
        ? new Date(n.request_info.start_date).toLocaleDateString()
        : 'No Start Date',
      rentedEndDate: n.request_info?.end_date
        ? new Date(n.request_info.end_date).toLocaleDateString()
        : 'No End Date',
      pricePerDay: n.product_info?.price || 'N/A',
      requestedBy:
        `${n.sender_info?.first_name || 'Unknown'} ${n.sender_info?.last_name || ''}`.trim(),
      totalAmount: n.request_info?.total_amount || 'N/A',
      renterContact: n.sender_info?.mobile || 'N/A',
      productId: n.product_info?._id,
      requestId: n.request_info?._id,
      status: n.request_info?.status || 'pending',
      type: n.type || 'request'
    }));

    res.render('notify', { notifications: transformed });

  } catch (err) {
    console.error('Notification Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
