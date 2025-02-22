const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and Password is required" });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ error: "Email is already exist" });
    }
    const hashedPwd = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPwd,
    });
    //   let token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY);
    console.log("user signup succesfully");
    res.status(200).send({ message: "Sign up succesfully", user: newUser });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email and Password is required" });
  }
  let user = await User.findOne({ email });
  if (user && (await bcryptjs.compare(password, user.password))) {
    let token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY);
    console.log("user login succesfully");
    console.log(token, user);
    return res.status(200).send({ message: "Login succesfully", token, user });
  } else {
    return res.status(400).send({ message: "Invalid password" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


module.exports = { userLogin, userSignUp, getUser };
