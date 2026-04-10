import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.port;
if (!PORT) {
  throw new Error("Please check .env file");
}
export default {
  PORT,
};
