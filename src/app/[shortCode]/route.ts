import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Url from '@/models/Url';
import Click from '@/models/Click';
import redis from '@/lib/redis';
import { UAParser } from 'ua-parser-js';

export async function GET(
  request: Request,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params;

    // 1. CACHE ASIDE: Check Redis first (Sub-millisecond lookup)
    if (redis) {
      const cachedUrl = await redis.get(`link:${shortCode}`);
      if (cachedUrl) {
        // Cache hit! We redirect instantly without hitting the database.
        // (Note: To track analytics accurately with Redis, we'd fire an async job or use a queue, 
        // but for simplicity in this demo, we'll just redirect).
        return NextResponse.redirect(cachedUrl, 302);
      }
    }

    // 2. Connect to MongoDB (Cache Miss)
    await connectToDatabase();

    // 3. Find the URL document by its short code
    const urlDoc = await Url.findOne({ shortCode });

    // 3. If it doesn't exist, redirect to a 404 page or back to home
    if (!urlDoc) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 4. Update the basic click counter
    urlDoc.clicks += 1;
    await urlDoc.save();

    // 5. Fire off an async task to log detailed analytics (non-blocking)
    const userAgent = request.headers.get('user-agent') || '';
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';
    const deviceType = parser.getDevice().type || 'Desktop';
    
    // We don't await this because we want the redirect to be as fast as possible.
    Click.create({
      linkId: urlDoc._id,
      browser,
      os,
      device: deviceType === 'mobile' || deviceType === 'tablet' ? 'Mobile' : 'Desktop',
      // country: Could use a geo-ip lookup here in the future
    }).catch(err => console.error('Failed to log click analytics:', err));

    // 6. CACHE WRITE: Save it to Redis for the next person (Expires in 1 hour)
    if (redis) {
      // SET with EX (expiration in seconds)
      await redis.set(`link:${shortCode}`, urlDoc.originalUrl, 'EX', 3600);
    }

    // 6. Perform a 302 Temporary Redirect to the original URL
    return NextResponse.redirect(urlDoc.originalUrl, 302);

  } catch (error) {
    console.error('Error in redirect route:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
