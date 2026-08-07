import { createClient } from "@supabase/supabase-js";
import env from "../config/env.js";
import crypto from "crypto";
import HttpError from "../errors/HttpError.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
const MIME_TYPES_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

export const uploadToSupabase = async (
  file: Express.Multer.File,
  folderName: "posts" | "avatars",
) => {
  const ext = MIME_TYPES_MAP[file.mimetype];
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`${folderName}/${fileName}`, file.buffer, {
      contentType: file.mimetype,
    });
  if (error) throw new HttpError(error.message, 500);
  return data.path;
};

export const getPublicUrl = (path: string) => {
  return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
};

export const removeFromSupabase = async (path: string) => {
  const { error } = await supabase.storage.from("images").remove([path]);
  if (error) throw new HttpError(error.message, 500);
};

export const DEFAULT_AVATAR_PATH = "avatars/defaultAvatar.png";
