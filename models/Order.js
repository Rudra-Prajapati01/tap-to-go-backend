import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "₹",
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        // Seller (owner of the products / digital card)
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Customer details
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },

        // Cart contents
        products: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "Order must contain at least one product.",
            },
        },

        // Pricing
        totalAmount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "INR",
        },

        // Razorpay references
        razorpayOrderId: {
            type: String,
            required: true,
            index: true,
        },
        razorpayPaymentId: {
            type: String,
            default: "",
        },
        razorpaySignature: {
            type: String,
            default: "",
        },

        // Payment lifecycle status
        paymentStatus: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
        // Order lifecycle status
        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        trackingNumber: {
            type: String,
            default: "",
        },

        shippingPartner: {
            type: String,
            default: "",
        },
        
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);