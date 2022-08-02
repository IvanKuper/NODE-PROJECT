const express = require("express");
const { User } = require("../models/User");
const router = express.Router();
const _ = require("lodash");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().required(),
  biz: joi.boolean().required(),
});

router.post("/", async (req, res) => {
  try {
    //1.1 joi validation
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    //1.2 checking if user is already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exist");

    // add new user
    user = new User(req.body);

    // האם צריך להוסיף את הביז בקוד???
    const generetedToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.secretKey
    );
    //1.4

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();

    //details that will be showed

    res.status(201).send(_.pick(user, ["_id", "name", "email", "biz"]));
  } catch (error) {
    res.status(400).send("cannot create u new user");
  }
});

module.exports = router;
