import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Url from '@/models/Url';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const token = cookies().get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch all links belonging to the user, sorted by newest first
    const userLinks = await Url.find({ userId: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ links: userLinks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
