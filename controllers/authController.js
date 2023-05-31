const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      res.status(400).json({
        status: "fail",
        message: "The confirm password is not match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = signToken(newUser.id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(req.body);
    if (!username || !password) {
      res.status(404).json({
        status: "fail",
        message: "Please provide email (username) and password",
      });
    }
    const user = await User.findOne({ where: { username } });
    console.log(user.username, user.password);
    const correct = await bcrypt.compare(password, user.password);

    if (!user || !correct) {
      res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    const token = signToken(user.id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Login fail",
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please login to get access.",
    });
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    res.status(401).json({
      status: "fail",
      message: "The User belonging to this token does no longer exist.",
    });
  }
  // 4) Check if user change password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError("User recently changed password! Please login again.", 401)
  //   );
  // }

  //GRANT ACCESS TO THE PROTECTED ROUTE
  req.user = currentUser;
  next();
};
