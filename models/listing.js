const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js"); // (Optional: only needed if using Review directly)

const listingSchema = new Schema({
  title: {
    type: String,
    required: true, // This field must be provided
  },
  description: String, // Optional field, type is String

  image: {
    url: String,
    filename: String
  },

  price: Number,      // Listing price
  location: String,   // e.g., city
  country: String,    // e.g., India, USA

  reviews: [ // Array of ObjectIds that refer to Review documents
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review", // Reference to the "Review" model
    }
  ],

  owner: { // Who created the listing
    type: Schema.Types.ObjectId,
    ref: "User", // Refers to the "User" model
  },
  
  likes: [{ // Array of user IDs who liked this listing
    type: Schema.Types.ObjectId,
    ref: "User",
  }]
});

// Export the model
module.exports = mongoose.model("Listing", listingSchema);

