const express = require("express");
const { checkSuperAdmin } = require("../middleware/checkSuperAdmin");
const passport = require("passport");
const router = express.Router();

router.use("/user", require("./userRoutes"));

router.use(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  checkSuperAdmin,
  require("./adminRoutes")
);

module.exports = router;
