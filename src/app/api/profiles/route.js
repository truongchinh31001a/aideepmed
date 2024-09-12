import { NextResponse } from 'next/server';
import connectMongo from '../../../../utils/connectMongo'; 
import Profile from '../../../../models/Profile'; 

export async function GET() {
  try {
    await connectMongo(); 

    const profileData = await Profile.find(); 

    return NextResponse.json({ profileData });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch data', error }, { status: 500 });
  }
}
