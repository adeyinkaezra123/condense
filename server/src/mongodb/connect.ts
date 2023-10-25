import {connect} from "mongoose";
import { config } from "dotenv";

config();
const mongoUsername = process.env?.MONGO_USERNAME;
const mongoPassword = process.env?.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;

const connectionString =
  "mongodb+srv://" +
  mongoUsername +
  ":" +
  mongoPassword +
  "@" +
  mongoHost +
  "/?retryWrites=true&w=majority";

export async function connectToMongoDB() {
  try {
    await connect(connectionString).then(() => {
      console.log("Connected to MongoDB!");
    });
  } catch (error) {
    console.error("Connection Error: ", error);
  }
}
