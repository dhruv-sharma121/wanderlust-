const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const usercontroller = require("../controller/user");

router
  .route("/signup")
  .get(usercontroller.renderSignupForm)
  .post(wrapAsync(usercontroller.signup));

router
  .route("/login")
  .get(usercontroller.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.login,
  );

router.get("/logout", usercontroller.logout);

module.exports = router;
