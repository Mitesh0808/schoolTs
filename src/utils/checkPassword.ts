const bcrypt = require("bcryptjs");
// import bcrypt from "bcrypt";
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<Boolean> {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error(error);
    return false;
  }
}
