const User = require("../models/user");

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

