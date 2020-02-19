const mongoose = require("mongoose");
// 1. core node module to crypt passwords
const crypto = require("crypto");
// 2. generate unique ids
const uuidv1 = require("uuid/v1");

// 3. create a schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    about: {
      type: String,
      trim: true
    },
    // used later to generate the hashed password
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    history: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);
