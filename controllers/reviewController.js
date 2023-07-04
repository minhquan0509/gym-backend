const {
  Room,
  User,
  sequelize,
  Review,
  PoolRating,
  ReviewImage,
} = require("../models/index");

exports.getAllComments = async (req, res) => {
  try {
    const room = await Room.findOne({
      where: { id: req.params.id },
    });

    const reviews = await Review.findAll({
      where: { room_id: room.id },
      include: [ReviewImage, PoolRating, { model: User, attributes: ["name"] }],
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
        reviews,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

const block = (res) => {
  return res.status(500).json({
    status: "block",
    message: "The CreateComment process is currently blocking",
  });
};

exports.createComment = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.id } });
    // console.log(room.pool);
    // return block(res);
    const currentUser = req.user;
    if (!room || !currentUser) {
      return res.status(404).json({
        status: "fail",
        message: "Can't find Room with that ID or User",
      });
    }

    const { review, rating, images, poolRating } = req.body;

    const newComment = await Review.create({
      user_id: currentUser.id,
      room_id: room.id,
      review,
      rating,
    });

    if (room.pool) {
      const newPoolRating = await PoolRating.create({
        review_id: newComment.id,
        rating: poolRating,
      });
    }
    // console.log(images);

    if (images.length > 0) {
      images.forEach(async (image) => {
        await ReviewImage.create({
          review_id: newComment.id,
          image: image,
        });
      });
    }

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

exports.deleteComment = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.id } });
    const review = await Review.findOne({ where: { id: req.params.reviewID } });
    const currentUser = req.user;
    if (!room || !currentUser || !review) {
      return res.status(404).json({
        status: "fail",
        message: "Can't find Room with that ID or User or Review",
      });
    }

    if (currentUser.id === review.user_id || currentUser.role === "admin") {
      // Adding this first
      await PoolRating.destroy({
        where: {
          review_id: req.params.reviewID,
        },
      });

      await Review.destroy({
        where: {
          id: req.params.reviewID,
        },
      });

      return res.status(204).json({
        status: "success",
        data: null,
      });
    }

    return res.status(400).json({
      status: "fail",
      data: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};
