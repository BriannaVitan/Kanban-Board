import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  // TODO: If the user exists and the password is correct, return a JWT token
  // Utility function for generating a JWT
  const {username, password} = req.body
  try {

  const user = await User.findOne({ where: { username } });
  
  // If user does not exist, return null
  if (!user) {return res.status(401).json({message: "username not found"})}
  
  // Check if the provided password matches the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {return res.status(401).json({message: "password not found"})}
  const secretKey = process.env.JWT_SECRET_KEY || '';
  // if (!secretKey) {
  //   throw new Error('Secret key is missing');
  // }
  // Generate a JWT token with an expiration of 1 hour
const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  return res.json({token})
} catch(error) {
  console.error(error)
  return res.status(500).json({error})
}
};


const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
