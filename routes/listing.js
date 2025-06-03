const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const { listingschema, reviewSchema } = require("../schema.js"); // Joi schemas
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Validation middleware for creating and updating listings
const validateListing = (req, res, next) => {
  const { error } = listingschema.validate(req.body);
  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }
  next();
};

// INDEX route – show all listings
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("image"), validateListing, wrapAsync(listingController.createListing));

// NEW route – render form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW, UPDATE, DELETE routes for a specific listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner,upload.single("image"), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// EDIT route – render edit form for a specific listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;





