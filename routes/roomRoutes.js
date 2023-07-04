const express = require("express");
const roomController = require("./../controllers/roomController");
const reviewController = require("./../controllers/reviewController");
const authController = require("../controllers/authController");
const uploadRoomController = require("../controllers/uploadRoomController");
const uploadReviewController = require("../controllers/uploadReviewController");
const router = express.Router();
const multer = require("multer");

router
  .route("/")
  .get(roomController.getAllRooms)
  .post(
    uploadRoomController.upload.array("images", 3),
    uploadRoomController.handlePostRoomImages,
    roomController.createRoom
  );
router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(multer().none(), roomController.updateRoom)
  .delete(roomController.deleteRoom);

router
  .route("/:id/reviews")
  .get(reviewController.getAllComments)
  .post(
    authController.protect,
    authController.restrictTo("admin", "user", "gym-owner"),
    uploadReviewController.upload.array("images", 3),
    uploadReviewController.handlePostReviewImage,
    reviewController.createComment
  );

router
  .route("/:id/reviews/:reviewID")
  .delete(
    authController.protect,
    authController.restrictTo("admin", "user", "gym-owner"),
    reviewController.deleteComment
  );

module.exports = router;
