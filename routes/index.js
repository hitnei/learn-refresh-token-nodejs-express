var express = require("express");
var router = express.Router();
const _CONF = require("../config");

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.json({ status: "success", elements: "Hello anonystick" });
});

module.exports = router;
