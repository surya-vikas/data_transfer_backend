const Clipboard = require("../models/clipboard");

const SECRET_PIN = process.env.SECRET_PIN;

// 💾 SAVE NOTE
async function saveText(req, res) {
  const { text, pin } = req.body;

  if (pin !== SECRET_PIN) {
    return res.status(401).json({ message: "Wrong PIN ❌" });
  }

  const photoName = req.file ? req.file.filename : null;

  const newNote = new Clipboard({
    text,
    pin,
    photo: photoName,
  });

  await newNote.save();

  res.json({
    message: "Note saved 🧠",
    note: newNote,
  });
}

// 📥 GET ALL NOTES
async function getText(req, res) {
  const pin = req.query.pin;

  if (pin !== SECRET_PIN) {
    return res.status(401).json({ message: "Wrong PIN ❌" });
  }

  const notes = await Clipboard.find({}).sort({ _id: -1 });
  res.json(notes);
}

// ✏️ UPDATE NOTE
async function updateNote(req, res) {
  const { id } = req.params;
  const { text, pin } = req.body;

  if (pin !== SECRET_PIN) {
    return res.status(401).json({ message: "Wrong PIN ❌" });
  }

  const updateData = {};
  if (text) updateData.text = text;
  if (req.file) updateData.photo = req.file.filename;

  const updatedNote = await Clipboard.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  res.json({
    message: "Note updated ✅",
    note: updatedNote,
  });
}

// 🗑️ DELETE NOTE
async function deleteNote(req, res) {
  const { id } = req.params;
  const { pin } = req.query;

  if (pin !== SECRET_PIN) {
    return res.status(401).json({ message: "Wrong PIN ❌" });
  }

  await Clipboard.findByIdAndDelete(id);

  res.json({ message: "Note deleted 🗑️" });
}

module.exports = {
  saveText,
  getText,
  updateNote,
  deleteNote,
};
