import Profile from '@models/Profile';
import Report from '@models/Report';
import { getTokenFromHeaders } from 'utils/jwt';

export async function POST(req) {
  try {
    const user = getTokenFromHeaders(req); // Get user from token
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { profileId, imageId, comment } = await req.json();

    // Create a new report
    const report = new Report({
      imageId,
      comment,
      user: user.userId, // Assign the user ID from token
    });

    await report.save();

    // Update profile
    const profile = await Profile.findById(profileId);
    const image = profile.images.id(imageId);
    image.status = false;
    image.reports.push(report._id); // Add report ID to image
    await profile.save();

    return new Response(JSON.stringify({ message: 'Report submitted successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error reporting image:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
