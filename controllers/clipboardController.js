const Clipboard = require("../models/clipboard");

const SECRET_PIN = process.env.SECRET_PIN;
const AUTO_DELETE_AFTER_DAYS = 14;

function getPin(req) {
  return req.body?.pin || req.query?.pin;
}

function validatePin(req, res) {
  if (getPin(req) !== SECRET_PIN) {
    res.status(401).json({ message: "Wrong PIN." });
    return false;
  }
  return true;
}

async function purgeExpiredDeletedNotes() {
  const cutoffDate = new Date(
    Date.now() - AUTO_DELETE_AFTER_DAYS * 24 * 60 * 60 * 1000
  );

  await Clipboard.deleteMany({
    isDeleted: true,
    deletedAt: { $lte: cutoffDate },
  });
}

function getViewFilter(view) {
  if (view === "archive") {
    return { archived: true, isDeleted: { $ne: true } };
  }

  if (view === "deleted") {
    return { isDeleted: true };
  }

  return { archived: { $ne: true }, isDeleted: { $ne: true } };
}

async function saveText(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    const { title, text, pin } = req.body;
    const photoName = req.file ? req.file.filename : null;

    const newNote = await Clipboard.create({
      title: typeof title === "string" ? title.trim() : "",
      text,
      pin,
      photo: photoName,
      archived: false,
      isDeleted: false,
      deletedAt: null,
    });

    res.status(201).json({
      message: "Note saved.",
      note: newNote,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not save note." });
  }
}

async function getText(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    await purgeExpiredDeletedNotes();

    const view = req.query.view || "active";
    const filter = getViewFilter(view);
    const notes = await Clipboard.find(filter).sort({ updatedAt: -1, _id: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Could not load notes." });
  }
}

async function updateNote(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    const { id } = req.params;
    const { title, text } = req.body;

    const updateData = {};
    if (typeof title === "string") {
      updateData.title = title.trim();
    }
    if (typeof text === "string") {
      updateData.text = text;
    }
    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const updatedNote = await Clipboard.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      updateData,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({
      message: "Note updated.",
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update note." });
  }
}

async function archiveNote(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    const note = await Clipboard.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { archived: true },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(200).json({ message: "Note archived.", note });
  } catch (error) {
    return res.status(500).json({ message: "Could not archive note." });
  }
}

async function unarchiveNote(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    const note = await Clipboard.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { archived: false },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(200).json({ message: "Note moved to General.", note });
  } catch (error) {
    return res.status(500).json({ message: "Could not unarchive note." });
  }
}

async function deleteNote(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    const note = await Clipboard.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      {
        isDeleted: true,
        deletedAt: new Date(),
        archived: false,
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(200).json({ message: "Note moved to Recently Deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete note." });
  }
}

async function restoreNote(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    const note = await Clipboard.findOneAndUpdate(
      { _id: req.params.id, isDeleted: true },
      {
        isDeleted: false,
        deletedAt: null,
        archived: false,
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Deleted note not found." });
    }

    return res.status(200).json({ message: "Note restored.", note });
  } catch (error) {
    return res.status(500).json({ message: "Could not restore note." });
  }
}

async function hardDeleteNote(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    const deletedNote = await Clipboard.findOneAndDelete({
      _id: req.params.id,
      isDeleted: true,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Deleted note not found." });
    }

    return res.status(200).json({ message: "Note permanently deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete note permanently." });
  }
}

async function clearDeletedNotes(req, res) {
  try {
    if (!validatePin(req, res)) {
      return;
    }

    const result = await Clipboard.deleteMany({ isDeleted: true });
    return res.status(200).json({
      message: "Recently Deleted cleared.",
      deletedCount: result.deletedCount || 0,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Could not clear Recently Deleted notes." });
  }
}

module.exports = {
  saveText,
  getText,
  updateNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
  restoreNote,
  hardDeleteNote,
  clearDeletedNotes,
};
