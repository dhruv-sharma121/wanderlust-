const express = require("express");
const app = express();

if(process.env.NODE_ENV != 'production'){
require('dotenv').config()
 
}
 

const path = require("path");
const mongoose = require("mongoose");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema.js");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
let ejsMate = require("ejs-mate");
const Listing = require("./models/listing");  
const Review = require("./models/review.js");
const flash=require("connect-flash");





const passport=require("passport");
const User=require("./models/user.js")
const LocalStrategy=require("passport-local")


 
const listingsRouter=require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLAS_URL;

main()
  .then(() => {
    console.log("connection established");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
const session = require("express-session");
const {MongoStore} = require('connect-mongo');

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{ 
    secret:process.env.SECRET
  },
  touchAfter:24*3600 ,//time for session refresh
  ttl: 14 * 24 * 60 * 60 //by default 
})

store.on("error", (err) => {
    console.log("Error in Mongo session store:", err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
      expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge:7 * 24 * 60 * 60 * 1000,
      httpOnly:true
    }
  }



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
})

app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter)


app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});



app.listen(5050, () => {
  console.log("App is listening");
});

 