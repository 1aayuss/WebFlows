import { config } from "dotenv";
config();

export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
export const HOOKS_URL = process.env.HOOKS_URL || "http://localhost:3003";
