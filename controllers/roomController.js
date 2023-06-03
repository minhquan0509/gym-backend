const { Room, User, sequelize, QueryTypes } = require("../models/index");

// Execute queryString
const queryStringFilter = (queryString) => {
  let query = "select * from rooms where ";
  const { name, address, priceMax, priceMin, service } = queryString;

  if (name) {
    query += `name like '%${name}%'`;
  }
  if (address) {
    if (name) {
      query += " and ";
    }
    query += `address like '%${address}%'`;
  }
  if (priceMax) {
    if (name || address) query += " and ";
    query += `price<${priceMax}`;
  }
  if (priceMin) {
    if (name || address || priceMax) query += " and ";
    query += `price>${priceMin}`;
  }
  if (service) {
    if (name || address || priceMax || priceMin) query += " and ";
    query += `${service}=1`;
  }
  return query;
};

// Checking the object is empty
function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
}

exports.getAllRooms = async (req, res) => {
  try {
    console.log(req.query);
    let rooms;
    if (!isEmptyObject(req.query)) {
      const sql = queryStringFilter(req.query);
      console.log(sql);
      rooms = await sequelize.query(sql, { type: QueryTypes.SELECT });
    } else {
      rooms = await Room.findAll();
    }

    return res.status(200).json({
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
    } else {
      const ownerUser = await User.findOne({ where: { id: room.owner_id } });

      // console.log(room.dataValues);

      return res.status(200).json({
        status: "success",
        data: {
          room: {
            ...room.dataValues,
            ownerName: ownerUser.name,
          },
        },
      });
    }
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

    if (req.body.hasOwnProperty("owner_id")) {
      const ownerUser = await User.findOne({
        where: { id: req.body.owner_id, role: "gym-owner" },
      });
      if (!ownerUser) {
        return res.status(404).json({
          status: "fail",
          message: "Invalid owner_id",
        });
      }
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
