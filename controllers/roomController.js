const { Room, User } = require("../models/index");

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json({
      status: "success",
      results: rooms.length,
      data: {
        rooms,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { owner_id } = req.body;
    const ownerUser = await User.findOne({
      where: { id: owner_id, role: "gym-owner" },
    });
    console.log(ownerUser);
    if (!ownerUser) {
      return res.status(404).json({
        status: "error",
        message: "Can't find owner user",
      });
    }
    const newRoom = await Room.create(req.body);
    return res.status(200).json({
      status: "success",
      data: {
        room: newRoom,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.id } });
    // console.log(room);
    if (!room) {
      return res.status(400).json({
        status: "fail",
        message: "No room found with that ID",
      });
    } else
      return res.status(200).json({
        status: "success",
        data: {
          room,
        },
      });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.id } });
    // console.log(room);
    if (!room) {
      return res.status(400).json({
        status: "fail",
        message: "No room found with that ID",
      });
    }
    await Room.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    const updatedRoom = await Room.findOne({ where: { id: req.params.id } });

    return res.status(200).json({
      status: "success",
      data: {
        room: updatedRoom,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.id } });
    if (!room) {
      return res.status(400).json({
        status: "fail",
        message: "No room found with that ID",
      });
    }
    await Room.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error,
    });
  }
};
