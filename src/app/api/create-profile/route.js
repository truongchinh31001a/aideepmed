import { NextResponse } from 'next/server';
import Profile from '../../../../models/Profile'; 
import { sendImageToThirdPartyAPI } from '../../../../services/sendImageToThirdPartyAPI';
import path from 'path';
import { promises as fs } from 'fs'; 
import connectMongo from '../../../../utils/connectMongo';

export async function POST(req) {
  await connectMongo(); 

  const formData = await req.formData(); 
  const name = formData.get('name');
  const files = formData.getAll('images');

  if (!name || files.length === 0) {
    return NextResponse.json({ message: 'Profile name and images are required' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads'); 
  await fs.mkdir(uploadDir, { recursive: true }); 

  const images = await Promise.all(files.map(async (file) => {
    const filePath = `/uploads/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await fs.writeFile(`./public${filePath}`, buffer); 

    return {
      filename: file.name,
      path: filePath,
      originalname: file.name,
    };
  }));

  let profile = new Profile({
    name,
    images,
  });
  await profile.save();

  const updatedImages = await Promise.all(images.map(async (image) => {
    try {
      const thirdPartyResult = await sendImageToThirdPartyAPI(`./public${image.path}`);
      return {
        ...image,
        thirdPartyInfo: thirdPartyResult, 
      };
    } catch (error) {
      console.error(`Failed to process image ${image.filename}: ${error.message}`);
      return image;
    }
  }));

  profile.images = updatedImages;
  await profile.save(); 

  return NextResponse.json({
    message: 'Profile created and updated with third-party info successfully',
    profile,
  });
}

export const config = {
  api: {
    bodyParser: false, 
  },
};
