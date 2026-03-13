const express = require("express");
const upload = require("../config/upload");
const {
  saveText,
  getText,
  updateNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
  restoreNote,
  hardDeleteNote,
  clearDeletedNotes,
} = require("../controllers/clipboardController");

const router = express.Router();

router.post("/save", upload.single("photo"), saveText);
router.get("/get", getText);
router.put("/update/:id", upload.single("photo"), updateNote);
router.put("/archive/:id", archiveNote);
router.put("/unarchive/:id", unarchiveNote);
router.put("/restore/:id", restoreNote);
router.delete("/delete/:id", deleteNote);
router.delete("/hard-delete/:id", hardDeleteNote);
router.delete("/clear-deleted", clearDeletedNotes);

module.exports = router;
