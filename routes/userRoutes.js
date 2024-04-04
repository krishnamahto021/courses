const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/userController");
const passport = require("passport");

router.post("/sign-up", upload.single("profilePicture"), userController.signup);

router.post("/sign-in", userController.signIn);

router.get("/filter/courses", userController.filterCourses);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);
router.put(
  "/",
  upload.single("profilePicture"),
  passport.authenticate("jwt", { session: false }),
  userController.updateProfile
);

router.post(
  "/enroll-course/:id",
  passport.authenticate("jwt", { session: false }),
  userController.enrollInCourse
);
router.get(
  "/view-course",
  passport.authenticate("jwt", { session: false }),
  userController.viewEnrolledCourses
);

module.exports = router;
