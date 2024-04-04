const validator = require("validator");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const passwordHelper = require("../helpers/passwordHelper");
const { uploadImageToCloudinary } = require("../helpers/imageUploader");

const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      passwordHelper.validatePassword(password);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const hashedPassword = await passwordHelper.hashingPasswordFunction(
      password
    );
    let profilePicture;
    if (req.file) {
      profilePicture = await uploadImageToCloudinary(req.file);
    }

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      profilePicture,
    });

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const matchPassword = await passwordHelper.compareHashedPasswordFunction(
        password,
        user.password
      );
      if (matchPassword) {
        const jwtToken = await jwt.sign(
          user.toJSON(),
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "60d",
          }
        );
        return res.status(200).send({
          success: true,
          message: "User signin successful",
          user: {
            jwtToken,
          },
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Incorrect password",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "You are not registered",
      });
    }
  } catch (error) {
    console.log(`Error in signing in the user ${error}`);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.profile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updatedFields = req.body;
    let profilePicture;
    if (req.file) {
      profilePicture = await uploadImageToCloudinary(req.file);
      updatedFields.profilePicture = profilePicture;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ error: "User is already enrolled in this course" });
    }

    // Enroll user in the course
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "Course enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.viewEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).populate({
      path: "enrolledCourses",
      options: { sort: { createdAt: -1 }, limit: limit, skip: skip },
    });

    res.status(200).json({ enrolledCourses: user.enrolledCourses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.filterCourses = async (req, res) => {
  try {
    const { category, level, page } = req.query;
    const limit = 10;
    const query = {};
    if (category) {
      query.category = category;
    }
    if (level) {
      query.level = level;
    }

    const skip = (parseInt(page) - 1) * limit || 0;

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
