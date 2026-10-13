import mongoose from "mongoose";

function dbConnection() {
  const DB_URL = `mongodb+srv://anuragguptakit_db_user:xc0wI4m3zHee6l53@cluster0.wom7kqh.mongodb.net/apnaTodo`;
    const db = mongoose.connect(DB_URL);
    db.then((data) =>
      console.log("data", data.connection._connectionString),
    ).catch((error) => console.log("error", error));
}
export default dbConnection