const express = require("express");
const roomController = require("./../controllers/roomController");
const reviewController = require("./../controllers/reviewController");
const authController = require("../controllers/authController");
const uploadRoomController = require("../controllers/uploadRoomController");
const router = express.Router();

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
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

router
  .route("/:id/reviews")
  .get(reviewController.getAllComments)
  .post(
    authController.protect,
    authController.restrictTo("admin", "user", "gym-owner"),
    reviewController.createComment
  );

module.exports = router;
