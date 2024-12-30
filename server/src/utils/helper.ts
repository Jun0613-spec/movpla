import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "15m"
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "7d"
  });
};

export const toBoolean = (
  value: string | undefined,
  defaultValue: boolean = false
): boolean => {
  if (value === undefined || value === null) return defaultValue;

  return value.toLowerCase() === "true";
};
