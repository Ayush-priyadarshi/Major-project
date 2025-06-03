if(process.env.NODE_ENV!="prodeuction"){
  require('dotenv').config()
  
}



const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const dburl=process.env.ATLASDB_URL;

// Connect to MongoDB
async function main() {
  await mongoose.connect(dburl);
}
main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log(err);
});

// Middleware and app setup
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride("_method"));
app.engine('ejs', ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("error in the session store",err);
})
// Session options
const sessionoption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};


// Use session and flash
app.use(session(sessionoption));
app.use(flash());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Flash + current user middleware (must come after passport)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("hi");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  let { status = 500, message } = err;
  res.status(status).render("listings/error.ejs", { message });
});

// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

