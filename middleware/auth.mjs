import pkg from 'jsonwebtoken';
import dotenv from 'dotenv'

const { verify } = pkg;
const { sign } = pkg;
dotenv.config()

const config = process.env;

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  token = token.split(' ')

  if (token[0] !== 'Bearer') {
    return res.status(403).send("A token is required for authentication");
  } 

  try {
    const decoded = verify(token[1], config.JWT_SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export const generateToken = async (domain, id) => {
  return sign(
    { user_id: domain , id: id },
    config.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
}

// console.log(generateToken(database['enrique'].domain, database['enrique'].id))

export default verifyToken;
