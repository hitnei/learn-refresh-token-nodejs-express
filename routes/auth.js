var express = require("express");
var router = express.Router();
const _CONF = require("../config");
var jwt = require("jsonwebtoken");

var refreshTokens = {}; // tao mot object chua nhung refreshTokens

router.get("/", function (req, res, next) {
  return res.json({ status: "success", elements: "auth" });
});

/* LOGIN . */
router.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  if (username === "anonystick.com" && password === "anonystick.com") {
    let user = {
      username: username,
      role: "admin",
    };
    const token = jwt.sign(user, _CONF.SECRET, { expiresIn: _CONF.tokenLife }); // 10 seconds
    const refreshToken = jwt.sign(user, _CONF.SECRET_REFRESH, {
      expiresIn: _CONF.refreshTokenLife, // 2 minutes
    });

    const response = {
      status: "Logged in",
      token: token,
      refreshToken: refreshToken,
    };

    refreshTokens[refreshToken] = response;

    return res.json(response);
  }
  return res.json({ status: "success", elements: "Login failed!!!" });
});

/* Get new token when jwt expired . */

router.post("/token", (req, res) => {
  // refresh the damn token
  const { refreshToken } = req.body;
  // if refresh token exists
  if (refreshToken && refreshToken in refreshTokens) {
    const user = {
      username: "anonystick.com",
      role: "admin",
    };
    const token = jwt.sign(user, _CONF.SECRET, { expiresIn: _CONF.tokenLife });
    const response = {
      token: token,
    };
    // update the token in the list
    refreshTokens[refreshToken].token = token;
    res.status(200).json(response);
  } else {
    res.status(404).send("Invalid request");
  }
});

module.exports = router;
