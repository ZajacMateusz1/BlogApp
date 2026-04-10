import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
if (!PORT || !DATABASE_URL) {
  throw new Error("Please check .env file");
}
export default {
  PORT,
  DATABASE_URL,
};
