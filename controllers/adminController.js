const Course = require("../models/courseModel");

module.exports.createCourse = async (req, res) => {
  try {
    const { title, category, level, description, price } = req.body;

    const newCourse = await Course.create({
      title,
      category,
      level,
      description,
      price,
    });
    res.status(201).json({ message: "Course created successfully", newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    // Number of items per page
    const limit = 10;

    const skip = (page - 1) * limit;

    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total number of courses
    const totalCourses = await Course.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({
      courses,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updateFields = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateFields,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(400).json({ error: "No such course exists" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
