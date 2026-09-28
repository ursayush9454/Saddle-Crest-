const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // =========================
    // EMAIL VERIFICATION
    // =========================

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailOtpHash: {
      type: String,
      default: null,
      select: false,
    },

    emailOtpExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    emailOtpLastSentAt: {
      type: Date,
      default: null,
      select: false,
    },

    emailOtpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    // =========================
    // ADDRESSES
    // =========================

    addresses: [
      {
        label: {
          type: String,
          default: "",
          trim: true,
        },

        fullName: {
          type: String,
          default: "",
          trim: true,
        },

        phone: {
          type: String,
          default: "",
          trim: true,
        },

        addressLine1: {
          type: String,
          default: "",
          trim: true,
        },

        addressLine2: {
          type: String,
          default: "",
          trim: true,
        },

        city: {
          type: String,
          default: "",
          trim: true,
        },

        state: {
          type: String,
          default: "",
          trim: true,
        },

        pincode: {
          type: String,
          default: "",
          trim: true,
        },

        country: {
          type: String,
          default: "India",
          trim: true,
        },

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);