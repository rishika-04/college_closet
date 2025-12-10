import mongoose from "mongoose";
const requestSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    requester_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },

    total_amount: { type: Number, required: true },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
        default: 'pending'
    },

    created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Request || mongoose.model("Request", requestSchema);