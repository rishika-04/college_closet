import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    type: {
        type: String,
        enum: ['system', 'request', 'response'],
        required: true
    },

    related_request_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Request',
        required: false
    },

    related_product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },

    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },

    created_at: { type: Date, default: Date.now },
});



export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);