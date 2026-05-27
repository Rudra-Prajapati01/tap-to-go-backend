import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // UNIQUE PUBLIC ID
    uniqueId: {
      type: String,
      unique: true,
    },

    // PROFILE DETAILS
    firstName: {
      type: String,
      default: "",
    },

    lastName: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    // PERSONAL CONTACT
    phone: {
      type: String,
      default: "",
    },

    emailPublic: {
      type: String,
      default: "",
    },

    // LOCATION
    location: {
      type: String,
      default: "",
    },

    streetAddress: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    postcode: {
      type: String,
      default: "",
    },

    // COMPANY INFO
    companyName: {
      type: String,
      default: "",
    },

    companyContact: {
      type: String,
      default: "",
    },

    // WEBSITE
    website: {
      type: String,
      default: "",
    },

    // IMAGES
    profileImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    coverTheme: {
      type: String,
      default: "",
    },

    logoImage: {
      type: String,
      default: "",
    },

    // SOCIAL LINKS
    instagram: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    // QR SETTINGS
    qrActive: {
      type: Boolean,
      default: true,
    },

    totalScans: {
      type: Number,
      default: 0,
    },

    // ✅ LEAD FIELDS
    // ✅ LEAD FORM SETTINGS
    leadCapture: {

      enabled: {
        type: Boolean,
        default: true,
      },

      fields: {

        name: {
          type: Boolean,
          default: true,
        },

        email: {
          type: Boolean,
          default: true,
        },

        phone: {
          type: Boolean,
          default: true,
        },

        company: {
          type: Boolean,
          default: false,
        },

        message: {
          type: Boolean,
          default: false,
        },
      },
    },
    // THEME SETTINGS
    theme: {
      profileTheme: {
        type: String,
        default: "#7c3aed",
      },

      backgroundColor: {
        type: String,
        default: "#ffffff",
      },

      textColor: {
        type: String,
        default: "#000000",
      },

      buttonColor: {
        type: String,
        default: "#7c3aed",
      },

      buttonTextColor: {
        type: String,
        default: "#ffffff",
      },

      fontFamily: {
        type: String,
        default: "Poppins",
      },

      cardView: {
        type: String,
        default: "left",
      },
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User",
  userSchema
);