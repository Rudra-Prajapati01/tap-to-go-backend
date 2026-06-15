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

    resetOTP: {
      type: String,
      default: null,
    },

    resetOTPExpiry: {
      type: Date,
      default: null,
    },

    deleteOTP: {
      type: String,
      default: null,
    },

    deleteOTPExpiry: {
      type: Date,
      default: null,
    },


    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationOTP: {
      type: String,
      default: null,
    },

    verificationOTPExpiry: {
      type: Date,
      default: null,
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

    // ROLE

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // PROFILE STATUS

    profileStatus: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },

    // NFC CARD

    cardUID: {
      type: String,
      default: "",
    },

    cardStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    // CARD TYPE

    cardType: {
      type: String,
      enum: [
        "light",
        "custom",
        "google-review",
      ],
      default: "light",
    },

    // THEME SETTINGS
    theme: {
      profileTheme: {
        type: String,
        default: "#0B4DBB",
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
        default: "#0B4DBB",
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

    googleBusiness: {
      placeId: {
        type: String,
        default: "",
      },

      businessName: {
        type: String,
        default: "",
      },

      rating: {
        type: Number,
        default: 0,
      },

      totalReviews: {
        type: Number,
        default: 0,
      },
    },

    youtubeVideos: [
      {
        title: {
          type: String,
          default: ""
        },

        url: {
          type: String,
          required: true
        },

        videoId: {
          type: String,
          default: ""
        },

        thumbnail: {
          type: String,
          default: ""
        },

        featured: {
          type: Boolean,
          default: false
        },

        views: {
          type: Number,
          default: 0
        },

        sortOrder: {
          type: Number,
          default: 0
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    gallery: [
      {
        url: String,

        publicId: String,

        title: {
          type: String,
          default: "",
        },

        description: {
          type: String,
          default: "",
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    professionalBio: {
      goals: {
        type: String,
        default: "",
      },

      accomplishments: {
        type: String,
        default: "",
      },

      interests: {
        type: String,
        default: "",
      },

      networkDescription: {
        type: String,
        default: "",
      },

      networks: {
        type: [String],
        default: [],
      },

      skills: {
        type: String,
        default: "",
      },

      yearsInBusiness: {
        type: String,
        default: "",
      },

      yearsInCity: {
        type: String,
        default: "",
      },

      previousJobs: {
        type: String,
        default: "",
      },

      hobbies: {
        type: String,
        default: "",
      },

      cityOfResidence: {
        type: String,
        default: "",
      },

      burningDesire: {
        type: String,
        default: "",
      },

      unknownFact: {
        type: String,
        default: "",
      },

      successKey: {
        type: String,
        default: "",
      }
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