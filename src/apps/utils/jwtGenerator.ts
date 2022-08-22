import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({
  path: '../../env',
});

export function jwtGenerstor(user_id: any) {
  const payload = {
    user: user_id,
  };
  return jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: '10d' });
}
