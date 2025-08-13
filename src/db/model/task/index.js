import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    node_id: String,
    created_by_user_id: String,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export { Task };
