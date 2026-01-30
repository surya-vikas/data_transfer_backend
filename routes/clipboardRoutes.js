const express = require("express");
const router = express.Router();
const upload = require("../config/upload");

const {
  saveText,
  getText,
  updateNote,
  deleteNote,
} = require("../controllers/clipboardController");

router.post("/save", upload.single("photo"), saveText);
router.get("/get", getText);
router.put("/update/:id", upload.single("photo"), updateNote);
router.delete("/delete/:id", deleteNote);

module.exports = router;
