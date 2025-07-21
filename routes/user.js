const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const wrapAsync = require("../util/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users.js");

// TEST route to verify routing
router.get("/test", (req, res) => {
  res.send("✅ User routes are working!");
});

// SEARCH route
router.get("/search", userController.searchListings);

// HOME route - landing page
router.get("/", userController.renderHome);
router.get("/home", userController.renderHome);

// SIGNUP routes
router
  .route("/signup")
  .get(userController.renderSignupForm)            
  .post(wrapAsync(userController.signup));         

// LOGIN routes
router
  .route("/login")
  .get(userController.renderLoginForm)              
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: "Invalid username or password.",
    }),
    userController.login                             
  );

// ✅ LOGOUT route (POST method is correct)
router
  .route("/logout")
  .post(userController.logout);                      

module.exports = router;


