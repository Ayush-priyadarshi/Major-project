const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDb = async () => {
  await Listing.deleteMany(); // Delete existing listings

  // Add an "owner" field to each listing
  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "6820f7e7c46a009015b34c99", // Dummy ObjectId of a user
  }));

  // Insert modified data into DB
  await Listing.insertMany(listingsWithOwner);

  console.log("Data was initialized");
};

initDb();
