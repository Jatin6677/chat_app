import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET,
 
  );
  return token;
};

export { generateToken };
