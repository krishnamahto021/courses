const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/create-course", adminController.createCourse);

router.get("/get-courses", adminController.getAllCourses);
router.put("/update-course/:id", adminController.updateCourse);
router.delete("/delete-course/:id", adminController.deleteCourse);
module.exports = router;
