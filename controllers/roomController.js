const { Room, User, sequelize, QueryTypes, Image } = require("../models/index");

// Execute queryString
const queryStringFilter = (queryString) => {
  let query = "select * from rooms where status!=0 and ";
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
    // query += `${service}=1`;
    for (const el in service) {
      query += `${el}=1 and `;
    }
    return (
      query.slice(0, query.length - 4) +
      " order by rating desc, pool_rating desc"
    );
  }

  return query + " order by rating desc, pool_rating desc";
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
      // console.log(rooms);

      // Rooms with images

      const imgRooms = rooms.map(async (room) => {
        // console.log(room);
        const images = await Image.findAll({ where: { room_id: room.id } });
        // console.log(images);
        const imagesObj = images.map((img) => {
          return img.dataValues;
        });
        // console.log(imagesObj);
        const value = { ...room, Images: imagesObj };
        // console.log(value);
        return value;
      });

      rooms = await Promise.all(imgRooms);
    } else {
      rooms = await Room.findAll({
        include: Image,
        where: {
          status: 1,
        },
        order: [
          ["rating", "desc"],
          ["pool_rating", "desc"],
        ],
      });
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
    const { images } = req.body;
    delete req.body["images"];

    // return res.json({
    //   data: req.body,
    // });

    const { owner_id } = req.body;
    const ownerUser = await User.findOne({
      where: { id: owner_id, role: "gym-owner" },
    });
    // console.log(ownerUser);
    if (!ownerUser) {
      return res.status(404).json({
        status: "error",
        message: "Can't find owner user",
      });
    }
    const newRoom = await Room.create(req.body);

    // Insert the images of room into the database
    images.forEach(async (image) => {
      await Image.create({
        room_id: newRoom.id,
        image: image,
      });
    });

    return res.status(201).json({
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
    const room = await Room.findOne({
      where: { id: req.params.id },
      include: Image,
    });
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
            lastLogin: ownerUser.lastLogin,
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
    req.body = JSON.parse(JSON.stringify(req.body));
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

    console.log(room);

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
      error: "Something went wrong...",
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

exports.inactiveRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.id } });
    if (!room) {
      return res.status(400).json({
        status: "fail",
        message: "No room found with that ID",
      });
    }

    // console.log(req.user.id, room.owner_id);

    if (req.user.id !== room.owner_id) {
      return res.status(400).json({
        status: "fail",
        message:
          "Inactive room fail because you are not the owner of this room",
      });
    } else {
      await room.update({ status: false });
      return res.status(200).json({
        status: "success",
        data: {
          room,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "Inactive room fail",
      error,
    });
  }
};

exports.activeRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { id: req.params.id } });
    if (!room) {
      return res.status(400).json({
        status: "fail",
        message: "No room found with that ID",
      });
    }

    // console.log(req.user.id, room.owner_id);

    if (req.user.id !== room.owner_id) {
      return res.status(400).json({
        status: "fail",
        message:
          "Activate room fail because you are not the owner of this room",
      });
    } else {
      await room.update({ status: true });
      return res.status(200).json({
        status: "success",
        data: {
          room,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "Activate room fail",
      error,
    });
  }
};
