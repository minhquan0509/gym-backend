const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "rooms"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + uuidv4();
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Unsupported File !!"));
  }
};

exports.upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

const hostName = "127.0.0.1:3001/rooms/";

exports.handlePostRoomImages = (req, res, next) => {
  try {
    const roomImages = req.files.map((file) => {
      return hostName + file.filename;
    });
    req.body.images = roomImages;

    // console.log(req.body);

    // return res.status(200).json({
    //   status: "success",
    //   data: {
    //     images: req.body.images,
    //   },
    // });

    return next();
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "Some error when uploading file...",
    });
  }
};
