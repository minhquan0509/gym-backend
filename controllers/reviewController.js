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

const block = (res) => {
  return res.status(500).json({
    status: "block",
    message: "The createComment is currently blocking",
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
        message: "Can't find Room with that id or User",
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
