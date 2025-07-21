const User = require("../models/user");
const airbnbAPI = require("../util/airbnbApi");

module.exports.renderHome = async (req, res) => {
  try {
    console.log("🏠 Rendering home page...");
    
    // Try to get featured listings from Airbnb API first
    console.log("📡 Fetching from Airbnb API...");
    let featuredListings = await airbnbAPI.getFeaturedListings();
    console.log("📊 API Response:", featuredListings);
    
    // If API fails or no listings, fall back to database listings
    if (!featuredListings || featuredListings.length === 0) {
      console.log("🔄 Falling back to database listings...");
      featuredListings = await require("../models/listing").find({}).limit(6);
      console.log("🗄️ Database listings:", featuredListings);
    }
    
    console.log("✅ Final featured listings count:", featuredListings.length);
    res.render("home.ejs", { featuredListings });
  } catch (error) {
    console.error('❌ Error in renderHome:', error);
    // Fallback to database listings
    const featuredListings = await require("../models/listing").find({}).limit(6);
    console.log("🔄 Fallback listings count:", featuredListings.length);
    res.render("home.ejs", { featuredListings });
  }
};

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Wrap req.login in a Promise so we can await it
    await new Promise((resolve, reject) => {
      req.login(registeredUser, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    req.flash("success", "Welcome to Wanderlust!");

    // Redirect to originally requested URL or default
    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);

  } catch (e) {
    req.flash("error", e.message || "Something went wrong!");
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");

  // Redirect to originally requested URL or default
  const redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out.");
    res.redirect("/listings");
  });
};

module.exports.searchListings = async (req, res) => {
  try {
    const { q: query, location } = req.query;
    console.log("🔍 Search request:", { query, location });
    
    if (!query && !location) {
      return res.redirect("/listings");
    }
    
    // Search using Airbnb API
    const searchResults = await airbnbAPI.searchListings(query || '', location || '');
    
    if (searchResults && !searchResults.error) {
      const alllistings = searchResults.results.map(listing => airbnbAPI.transformListing(listing));
      console.log(`✅ Found ${alllistings.length} search results`);
      res.render("listings/index.ejs", { 
        alllistings, 
        searchQuery: query,
        searchLocation: location,
        isSearch: true
      });
    } else {
      // Fallback to database search
      const alllistings = await require("../models/listing").find({
        $or: [
          { title: { $regex: query || '', $options: 'i' } },
          { location: { $regex: location || '', $options: 'i' } },
          { country: { $regex: query || '', $options: 'i' } }
        ]
      });
      
      res.render("listings/index.ejs", { 
        alllistings, 
        searchQuery: query,
        searchLocation: location,
        isSearch: true
      });
    }
  } catch (error) {
    console.error('❌ Error in searchListings:', error);
    res.redirect("/listings");
  }
};

