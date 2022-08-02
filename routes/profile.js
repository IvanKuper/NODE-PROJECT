//3נקודת גישה בשיטת GET שתאפשר לקבלת פרטים מלאים על user לפי הזדהות עם ה
// token שהתקבל בעת פנייה להתחברות )מסעיף 2

const express = require("express");
const { User } = require("../models/User");
const auth = require("../middlewears/auth");
const _ = require("lodash");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.payload.email });
    res.status(200).send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    res.status(400).send("error in profile");
  }
});

module.exports = router;
