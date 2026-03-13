const express = require("express");
const { getUserLogs, getUserLogsByQuery } = require("../controllers/logsController");

const router = express.Router();

router.get("/", getUserLogsByQuery);
router.get("/:userId", getUserLogs);

module.exports = router;
