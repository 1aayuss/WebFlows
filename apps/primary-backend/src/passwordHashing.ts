import bcrypt from "bcryptjs";
export const hashpass = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparepass = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
