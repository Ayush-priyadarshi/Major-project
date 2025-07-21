const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else {
    // Assign default image
    newListing.image = {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      filename: "default-unsplash",
    };
  }

  newListing.owner = req.user._id;
  await newListing.save();

  req.flash("success", "Listing added successfully");
  res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Update the listing and get the updated document
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (req.file) {
    // Update the image info
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedlisting = await Listing.findByIdAndDelete(id);

  if (!deletedlisting) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};

module.exports.toggleLike = async (req, res) => {
  try {
    const { listingId, action } = req.body;
    const userId = req.user._id;

    if (!listingId) {
      return res.status(400).json({ 
        success: false, 
        message: "Listing ID is required" 
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        message: "Listing not found" 
      });
    }

    // Initialize likes array if it doesn't exist
    if (!listing.likes) {
      listing.likes = [];
    }

    const userLiked = listing.likes.includes(userId);

    if (action === 'like' && !userLiked) {
      // Add like
      listing.likes.push(userId);
      await listing.save();
      return res.json({ 
        success: true, 
        message: "Added to favorites",
        liked: true 
      });
    } else if (action === 'unlike' && userLiked) {
      // Remove like
      listing.likes = listing.likes.filter(id => !id.equals(userId));
      await listing.save();
      return res.json({ 
        success: true, 
        message: "Removed from favorites",
        liked: false 
      });
    } else {
      return res.json({ 
        success: true, 
        message: userLiked ? "Already in favorites" : "Not in favorites",
        liked: userLiked 
      });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error occurred" 
    });
  }
};