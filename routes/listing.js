const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer')

const {storage,cloudinary}=require("../cloudConfig.js")
const upload = multer({storage})

//index and add listing
router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn,
  validateListing,upload.single('listing[image]'),
  wrapAsync(listingController.createListing),
);


//new route
router.get(
  "/new",isLoggedIn,
  wrapAsync(listingController.renderNewForm),
);



router.get("/search",wrapAsync(listingController.searchListing));

//show and update and delete
router.route("/:id").get(
  wrapAsync(listingController.showListing),
).put(isLoggedIn,isOwner,upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing),
).delete(isLoggedIn,isOwner,
  wrapAsync(listingController.destroyListing)
);





//edit route
router.get(
  "/:id/edit",isLoggedIn,isOwner,
  wrapAsync(listingController.renderEditForm)
);



module.exports=router;
