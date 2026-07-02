import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Url from '@/models/Url';
import { nanoid } from 'nanoid';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. Connect to the MongoDB database
    await connectToDatabase();

    // 2. Extract the long URL from the request body
    const body = await req.json();
    const { originalUrl, customAlias } = body;

    if (!originalUrl) {
      return NextResponse.json({ error: 'originalUrl is required' }, { status: 400 });
    }

    // 3. Check if user is logged in to associate the link
    const token = cookies().get('auth_token')?.value;
    let userId = null;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    // 4. Determine the short code (Custom or Random)
    let finalShortCode = '';
    
    if (customAlias) {
      // Validate custom alias format (alphanumeric and hyphens only)
      if (!/^[a-zA-Z0-9-]+$/.test(customAlias)) {
        return NextResponse.json({ error: 'Custom alias can only contain letters, numbers, and hyphens' }, { status: 400 });
      }
      
      // Check if alias is already taken
      const existing = await Url.findOne({ shortCode: customAlias });
      if (existing) {
        return NextResponse.json({ error: 'Custom alias is already taken' }, { status: 409 });
      }
      finalShortCode = customAlias;
    } else {
      // Generate random string
      finalShortCode = nanoid(6);
    }

    // 5. Create a new Url document using our Mongoose model
    const newUrl = await Url.create({
      originalUrl,
      shortCode: finalShortCode,
      userId,
    });

    // 6. Return the created document as JSON
    return NextResponse.json(newUrl, { status: 201 });

  } catch (error) {
    console.error('Error in /api/shorten:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
