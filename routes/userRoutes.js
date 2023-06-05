const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("../controllers/authController");
const uploadAvatarController = require("../controllers/uploadAvatarController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.route("/").get(
  // authController.protect,
  // authController.restrictTo("guest"),
  userController.getAllUsers
);

router
  .route("/avatar")
  .post(
    uploadAvatarController.upload.single("avatar"),
    uploadAvatarController.postAvatar
  );

module.exports = router;
