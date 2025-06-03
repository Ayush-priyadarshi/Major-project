const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const listingController=require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    return next(new ExpressError(400, error.details[0].message));
  }
  next();
};

// POST a new review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(listingController.createReview));

// DELETE a review - only if logged in and author
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(listingController.destroyReview));

module.exports = router;
