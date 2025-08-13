import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    color: String,
    created_by_user_id: String,
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export { Note };
