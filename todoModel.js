import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "ongoing"],
      default: "pending",
    },
  },

  {
    // strict: false,
  },
);

const TodoModel = mongoose.model("todoModel", todoSchema);

export default TodoModel;
