import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const BUG_ANALYZER_KEY = process.env.BUG_ANALYZER_KEY;
const BUG_ANALYZER_API_URL = process.env.BUG_ANALYZER_API_URL;
if (
  !PORT ||
  !DATABASE_URL ||
  !JWT_SECRET ||
  !SUPABASE_URL ||
  !SUPABASE_SECRET_KEY ||
  !BUG_ANALYZER_KEY ||
  !BUG_ANALYZER_API_URL
) {
  throw new Error("Please check .env file");
}
export default {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  BUG_ANALYZER_KEY,
  BUG_ANALYZER_API_URL,
};
