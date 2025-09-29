import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, PDFImage, rgb, StandardFonts } from 'pdf-lib';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from 'fs';
import path from 'path';
import {getAuth} from '@clerk/nextjs/server';
import {db} from '@/lib/db';


interface SignAgreementRequest {
  fullName: string;
  email: string;
  signature: string;
  timestamp: string;
}

interface SignAgreementResponse {
  success: boolean;
  message: string;
  signedPdfUrl?: string;
  error?: string;
}

// Initialize S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getDownloadLink(s3Key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: s3Key,
  });

  // Signed URL valid for 1 hour
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}


// Helper function to get client IP
const getClientIP = (req: NextApiRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : req.connection.remoteAddress;
  return ip || 'Unknown';
};

// Helper function to convert base64 to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const binaryData = Buffer.from(base64Data, 'base64');
  return new Uint8Array(binaryData);
};


const addTextToPDF = async (
  pdfDoc: PDFDocument,
  text: string,
  x: number,
  y: number,
  fontSize: number = 12,
  pageIndex: number = 0 // default = first page
) => {
  const pages = pdfDoc.getPages();
  if (pageIndex < 0 || pageIndex >= pages.length) {
    throw new Error(`Invalid page index: ${pageIndex}`);
  }

  const page = pages[pageIndex];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
};

// Add image to a specific page
const addImageToPDF = async (
  pdfDoc: PDFDocument,
  imageData: Uint8Array,
  x: number,
  y: number,
  width: number,
  height: number,
  pageIndex: number = 0
) => {
  const pages = pdfDoc.getPages();
  if (pageIndex < 0 || pageIndex >= pages.length) {
    throw new Error(`Invalid page index: ${pageIndex}`);
  }

  const page = pages[pageIndex];
  const image = await pdfDoc.embedPng(imageData);

  page.drawImage(image, {
    x,
    y,
    width,
    height,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignAgreementResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'Only POST method is allowed'
    });
  }

  try {
    const { email, signature, timestamp }: SignAgreementRequest = req.body;
    const clientIP = getClientIP(req);

    // Validate required fields
    if ( !email || !signature || !timestamp) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: 'fullName, email, signature, and timestamp are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        error: 'Please provide a valid email address'
      });
    }

    const { userId: clerkId } = getAuth(req);

    if(!clerkId){
      return res.status(400).json({success : false , message : "Unauthenticated"});
    }

    const user = await db.user.findUnique({
      where:{
        clerkId
      },select:{
        email: true,
        fullName: true,
        id: true,
        address: true,
        phone: true
      }
    })

    if(!user){
      return res.status(400).json({success : false , message : "Unauthenticated"});

    }

    if(email !== user.email){
      return res.status(400).json({success : false , message : "Unauthenticated"});

    }


    // Load the PDF template
    const pdfPath = path.join(process.cwd(), 'public', 'agreements', 'service-agreement-v1.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF template not found at:', pdfPath);
      return res.status(500).json({
        success: false,
        message: 'Service agreement template not found',
        error: 'PDF template file is missing'
      });
    }

    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Get the first page
    const pages = pdfDoc.getPages();
    if (pages.length === 0) {
      throw new Error('PDF has no pages');
    }

    // const page = pages[0];
    // const { width, height } = page.getSize();

    // Convert signature from base64 to Uint8Array
    const signatureImageData = base64ToUint8Array(signature);

    // Add customer information to the PDF
    // These coordinates are approximate - you may need to adjust based on your actual PDF layout


    // Add customer details
// Page 1 fields
await addTextToPDF(pdfDoc, `Customer Name: ${user.fullName}`, 80, 570, 12, 0);
await addTextToPDF(pdfDoc, `Email: ${email}`, 80, 550, 12, 0);
await addTextToPDF(pdfDoc, `Address: ${user.address}`, 80, 530, 12, 0);
await addTextToPDF(pdfDoc, `Phone: ${user.phone}`, 80, 510, 12, 0);
await addTextToPDF(pdfDoc, `Date: ${new Date(timestamp).toLocaleDateString()}`, 80, 490, 12, 0);

// Last page signature
await addImageToPDF(pdfDoc, signatureImageData, 80, 175, 150, 60, 1);
await addTextToPDF(pdfDoc, 'Company Representative: [Your Company Name]', 330, 175, 12, 1);




    //Serialize the PDF
    const modifiedPdfBytes = await pdfDoc.save();

    // Generate unique filename
    const fileName = `${user.fullName.replace(/\s+/g, '-')}-${user.id}-${Date.now()}.pdf`;
    const s3Key = `signed-agreements/${fileName}`;

    //Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: s3Key,
      Body: modifiedPdfBytes,
      ContentType: 'application/pdf',
      Metadata: {
        'customer-name': user.fullName,
        'customer-email': email,
        'userId' : user.id,
        'signature-date': timestamp,
      }
    });

    await s3Client.send(uploadCommand);


    await db.progress.update({
      where:{
        clerkId
      },
      data:{
        S3key: s3Key,
        currentStep: 3
      }
    })

    const s3Url = await getDownloadLink(s3Key);



    return res.status(200).json({
      success: true,
      message: 'Agreement signed and uploaded successfully',
      signedPdfUrl: s3Url
    });

  } catch (error: any) {
    console.error('Error in sign-agreement API:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to process agreement signing',
      error: error.message || 'Internal server error'
    });
  }
}



