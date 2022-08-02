const express = require("express");
const { User } = require("../models/User");
const _ = require("lodash");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { boolean } = require("joi");
const router = express.Router();

const loginSchema = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(),
});

const generateToken = (payload, key) => {
  const token = jwt.sign(payload, key);
  return token;
};

//נקודת גישה בשיטת 2 POST שתאפשר חיבור ) login/signin ( של user לפי אימייל וסיסמה.

router.post("/", async (req, res) => {
  try {
    //2.1 בנקודת גישה זו יש לבצע ולידציה מקדימה לבדיקת תקינות תבנית לאימייל ולסיסמה
    // וכן לבצע בדיקה שהאימייל והסיסמה נכונים ובמידה ולא יש להוציא תגובה בסטטוס
    // 400 עם השגיאה הרלוונטית.
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    //check if the user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("invalid user");

    //3.check password
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send("invalid email or password");
    //2.2
    //send token to client
    const generetedToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.secretKey
    );
    res
      .status(200)
      .send({ token: generetedToken, biz: user.biz, id: user._id });
  } catch (error) {
    res.status(400).send("error in post ");
  }
});
module.exports = router;
