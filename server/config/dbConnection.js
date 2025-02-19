import mongoose from "mongoose";

const dbConnection = async () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log(`db connected successfully`))
    .catch((err) => console.log(err));
};

export default dbConnection;
