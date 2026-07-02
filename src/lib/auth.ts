import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing');
}
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: { userId: string; email: string }) {
  // Sign a JWT token that expires in 7 days
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string; email: string };
  } catch (error) {
    return null; // Token is invalid or expired
  }
}
