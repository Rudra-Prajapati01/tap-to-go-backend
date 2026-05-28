import mongoose from "mongoose";

const analyticsSchema =
    new mongoose.Schema(

        {

            userId: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",
            },

            profileViews: {

                type: Number,

                default: 0,
            },

            qrScans: {

                type: Number,

                default: 0,
            },

            nfcTaps: {

                type: Number,

                default: 0,
            },

            leads: {

                type: Number,

                default: 0,
            },

            linkClicks: {

                linkedin: {
                    type: Number,
                    default: 0,
                },

                instagram: {
                    type: Number,
                    default: 0,
                },

                whatsapp: {
                    type: Number,
                    default: 0,
                },

                website: {
                    type: Number,
                    default: 0,
                },

                email: {
                    type: Number,
                    default: 0,
                },

                github: {
                    type: Number,
                    default: 0,
                },

                twitter: {
                    type: Number,
                    default: 0,
                },

                youtube: {
                    type: Number,
                    default: 0,
                },

                facebook: {
                    type: Number,
                    default: 0,
                },
            },

            countryStats: [

                {

                    country: String,

                    views: {

                        type: Number,

                        default: 0,
                    },

                    leads: {

                        type: Number,

                        default: 0,
                    },
                },
            ],
        },

        {
            timestamps: true,
        }
    );

export default mongoose.model(
    "Analytics",
    analyticsSchema
);