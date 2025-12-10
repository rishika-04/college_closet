import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    uploader_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    category: { type: String, required: true },
    product_name: { type: String, required: true },
    model_name: { type: String },
    age_in_years: { type: Number },
    description: { type: String },
    price: { type: Number, required: true },

    status: { 
        type: String,
        enum: ['available', 'not available'],
        default: 'available'
    },

    image_url: { type: String, default: '/images/default_item.jpg' },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});


export default mongoose.models.Product || mongoose.model("Product", productSchema);