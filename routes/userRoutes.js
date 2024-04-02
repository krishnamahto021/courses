const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");

router.post("/sign-up", userController.signup);

router.post("/sign-in", userController.signIn);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.updateProfile
);
module.exports = router;
