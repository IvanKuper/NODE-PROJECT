const express = require("express");
const { Card } = require("../models/Card");
const router = express.Router();
const _ = require("lodash");
const joi = require("joi");
const auth = require("../middlewears/auth");
const { required } = require("joi");

const cardSchema = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  description: joi.string().required(),
  phone: joi
    .string()
    .required()
    .regex(/^0[2-9]\d{7,8}$/),
  image: joi.string().required(),
});

const genCardNumber = async () => {
  while (true) {
    let randomNum = _.random(1000, 9999999);
    let card = await Card.findOne({ cardNumber: randomNum });
    if (!card) return randomNum;
  }
};
router.post("/", auth, async (req, res) => {
  try {
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    //2.add cardNumber + userId
    let card = new Card(req.body);
    card.cardNumber = await genCardNumber();
    card.user_id = req.payload._id;
    //3.save card to db
    await card.save();
    res.status(201).send(card);
  } catch {
    res.status(400).send("error in post card");
  }
});
//8. Card of specific user

router.get("/my-cards", auth, async (req, res) => {
  try {
    const myCards = await Card.find({
      user_id: req.payload._id,
    });
    if (myCards.length === 0) return res.status(404).send("card not found");
    res.status(200).send(myCards);
  } catch (error) {
    res.status(400).send("card not found");
  }
});
//get specific card of specific user

///5
router.get("/:id", auth, async (req, res) => {
  try {
    let card = await Card.findOne({
      _id: req.params.id,
      user_id: req.payload._id,
    });
    if (!card) return res.status(404).send("card not found");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("erro in get specific card");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    let card = await Card.findOneAndUpdate(
      { _id: req.params.id, user_id: req.payload._id },
      req.body,
      { new: true }
    );
    if (!card) return res.status("Card was not found");
    res.status(200).send(card);
  } catch (error) {
    res.status(400).send("Error in put specific card");
  }
});

////7. delete card
router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await Card.findOneAndRemove({
      _id: req.params.id,
      user_id: req.payload._id,
    });
    if (!card) return res.status(404).send("card not found");
    res.status(200).send("card deleted");
  } catch (error) {
    res.status(400).send("card not found");
  }
});

//9.get all cards
router.get("/", auth, async (req, res) => {
  try {
    let cards = await Card.find();
    res.status(200).send(cards);
  } catch (error) {}
});
module.exports = router;
