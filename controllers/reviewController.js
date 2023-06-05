const { Room, User, sequelize, Review } = require("../models/index");

exports.getAllComments = async (req, res) => {
  try {
    const room = await Room.findOne({
      where: { id: req.params.id },
      include: Review,
    });

    if (!room) {
      return res.status(404).json({
        status: "fail",
        message: "Can't find Room with that id",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        Reviews: room.Reviews,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.id } });
    const currentUser = req.user;
    if (!room || !currentUser) {
      return res.status(404).json({
        status: "fail",
        message: "Can't find Room with that id or User",
      });
    }

    const { review, rating, image } = req.body;

    const newComment = await Review.create({
      user_id: currentUser.id,
      room_id: room.id,
      review: review ? review : null,
      rating,
      image,
    });

    return res.status(201).json({
      status: "success",
      data: {
        review: newComment,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
