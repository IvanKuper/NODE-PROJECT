const mongoose = require("mongoose");
// 4 . נקודת גישה בשיטת POST שתאפשר פתיחת כרטיס ביקור / כרטיס עסק לבעלי עסקים
// וחברות שיכלול את השדות: שם העסק, תיאור העסק, כתובת העסק, טלפון העסק,
// תמונת העסק )כתובת url ( וכן בעת שמירת כרטיס הביקור יונפק לכרטיס מספר רנדומלי
// אבל ייחודי )רמז – lodash random .)
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bizs",
  },
});
const Card = mongoose.model("cards", cardSchema);
module.exports = { Card };
