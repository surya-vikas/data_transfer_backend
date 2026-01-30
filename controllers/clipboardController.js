const Clipboard = require("../models/Clipboard");

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

module.exports = { saveText, getText };
