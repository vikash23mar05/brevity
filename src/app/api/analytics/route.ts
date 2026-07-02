import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Url from '@/models/Url';
import Click from '@/models/Click';
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

    const { searchParams } = new URL(req.url);
    const requestedLinkId = searchParams.get('linkId');

    await connectToDatabase();

    // 1. Get all links for this user (to populate the dropdown in the UI)
    const userLinks = await Url.find({ userId: payload.userId }).select('_id shortCode originalUrl createdAt');
    
    // Default to analyzing all user links
    let linkIdsToAnalyze = userLinks.map(link => link._id);

    // If a specific link was requested, verify it belongs to the user and filter the analytics
    if (requestedLinkId && requestedLinkId !== 'all') {
      const isOwner = userLinks.some(link => link._id.toString() === requestedLinkId);
      if (!isOwner) {
        return NextResponse.json({ error: 'Unauthorized to view this link' }, { status: 403 });
      }
      linkIdsToAnalyze = [requestedLinkId];
    }

    // 2. Aggregate clicks across the selected link(s)
    const totalClicks = await Click.countDocuments({ linkId: { $in: linkIdsToAnalyze } });

    // 3. Aggregate by Device (Mobile vs Desktop)
    const deviceStats = await Click.aggregate([
      { $match: { linkId: { $in: linkIdsToAnalyze } } },
      { $group: { _id: '$device', value: { $sum: 1 } } }
    ]);
    
    // Format device stats for Recharts (e.g., [{ name: 'Desktop', value: 10 }])
    const deviceData = deviceStats.map(stat => ({
      name: stat._id,
      value: stat.value
    }));

    // 4. Top Referrer (We'll use browser as a proxy since we didn't track referrer URL yet)
    // To make it interesting, we'll aggregate top browsers
    const browserStats = await Click.aggregate([
      { $match: { linkId: { $in: linkIdsToAnalyze } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    const topBrowser = browserStats.length > 0 ? browserStats[0]._id : 'No data yet';

    return NextResponse.json({
      totalClicks,
      deviceData,
      topBrowser,
      availableLinks: userLinks
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
