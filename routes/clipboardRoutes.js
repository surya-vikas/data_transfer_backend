const express = require("express");
const router = express.Router();
const upload = require("../config/upload");
const { saveText, getText } = require("../controllers/clipboardController");

router.post("/save", upload.single("photo"), saveText);
router.get("/get", getText);

module.exports = router;
