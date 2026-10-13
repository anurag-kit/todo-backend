import express from "express";
import dbConnection from "./mongodbConnection.js";
import TodoModel from "./todoModel.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnection();

app.get("/", function (req, res) {
  res.send("server running");
});

app.get("/todo", async function (req, res) {
  try {
    const limit = req.query.limit || 20;
    const page = req.query.page || 1;

    const q = req.query.search;
    console.log({ q });
    const query = !q ? {} : { title: { $regex: q, $options: "i" } };

    const skip = (page - 1) * limit;

    console.log(query);

    const todos = await TodoModel.find(query).skip(skip).limit(limit);
    const totalDocumentsCount = await TodoModel.countDocuments(query);
    res.status(200).json({ todos, totalDocumentsCount, limit });
  } catch (error) {
    res.status(500).json({ message: `Error:${error}` });
  }
});

app.get("/todo/:id", async function (req, res) {
  try {
    const todoId = req.params.id;

    const todos = await TodoModel.findById(todoId);

    res.status(200).json({ todos });
    
  } catch (error) {
    res.status(500).json({ message: `Error:${error}` });
  }
});

app.post("/todo", async function (req, res) {
  try {
    const payload = req.body;
    console.log("payload", payload);
    const newTodo = await TodoModel.create(payload);
    const todo = await newTodo.save();

    res.status(201).json({ message: "Todo created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.delete("/todo/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const todo = await TodoModel.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: "todo not found for given Id" });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: `Error:${error}` });
  }
});

app.put("/todo/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const payload = req.body;

    const todo = await TodoModel.findByIdAndUpdate(id, payload, { new: true });
    if (!todo) {
      return res.status(404).json({ message: "todo not found" });
    }
    res.status(200).json({ message: "todo updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` });
  }
});

app.listen(8080, function (error) {
  console.log(` server running on :  http://localhost:8080`);
});
