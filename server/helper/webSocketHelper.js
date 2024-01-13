import jwt from 'jsonwebtoken';

export default function generateAnonymousToken({secret}){
  const secretKey = secret;
  const payload = {
    userId: Math.random().toString(36).substring(2), // Generate a random userId
    anonymous: true,
  };
  const options = { expiresIn: '24h' };
  return jwt.sign(payload, secretKey, options);
};
