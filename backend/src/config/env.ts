import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
if (!PORT || !DATABASE_URL || !JWT_SECRET) {
  throw new Error("Please check .env file");
}
export default {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
};
