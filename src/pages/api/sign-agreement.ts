import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, PDFImage, rgb, StandardFonts } from 'pdf-lib';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

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
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

// Helper function to add text to PDF
// const addTextToPDF = (pdfDoc: PDFDocument, text: string, x: number, y: number, fontSize: number = 12) => {
//   const page = pdfDoc.getPages()[0];
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
//   page.drawText(text, {
//     x,
//     y,
//     size: fontSize,
//     font,
//     color: rgb(0, 0, 0),
//   });
// };
// Helper function to add text to PDF
// const addTextToPDF = async (
//     pdfDoc: PDFDocument,
//     text: string,
//     x: number,
//     y: number,
//     fontSize: number = 12
//   ) => {
//     const page = pdfDoc.getPages()[0];
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // <-- FIXED
    
//     page.drawText(text, {
//       x,
//       y,
//       size: fontSize,
//       font,
//       color: rgb(0, 0, 0),
//     });
//   };
  

// // Helper function to add image to PDF
// const addImageToPDF = async (pdfDoc: PDFDocument, imageData: Uint8Array, x: number, y: number, width: number, height: number) => {
//   try {
//     const page = pdfDoc.getPages()[0];
//     const image = await pdfDoc.embedPng(imageData);
    
//     page.drawImage(image, {
//       x,
//       y,
//       width,
//       height,
//     });
//   } catch (error) {
//     console.error('Error adding image to PDF:', error);
//     throw new Error('Failed to add signature image to PDF');
//   }
// };

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
    const { fullName, email, signature, timestamp }: SignAgreementRequest = req.body;
    const clientIP = getClientIP(req);

    // Validate required fields
    if (!fullName || !email || !signature || !timestamp) {
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
await addTextToPDF(pdfDoc, `Customer Name: ${fullName}`, 80, 570, 12, 0);
await addTextToPDF(pdfDoc, `Email: ${email}`, 80, 550, 12, 0);
await addTextToPDF(pdfDoc, `Address: ${req.body.address}`, 80, 530, 12, 0);
await addTextToPDF(pdfDoc, `Phone: ${req.body.phone}`, 80, 510, 12, 0);
await addTextToPDF(pdfDoc, `Date: ${new Date(timestamp).toLocaleDateString()}`, 80, 490, 12, 0);

// Last page signature
await addImageToPDF(pdfDoc, signatureImageData, 80, 175, 150, 60, 1);
await addTextToPDF(pdfDoc, 'Company Representative: [Your Company Name]', 330, 175, 12, 1);




    // Serialize the PDF
    // const modifiedPdfBytes = await pdfDoc.save();

    // // Generate unique filename
    // const fileName = `signed-agreement-${fullName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    // const s3Key = `signed-agreements/${fileName}`;

    // Upload to S3
    // const uploadCommand = new PutObjectCommand({
    //   Bucket: process.env.AWS_S3_BUCKET!,
    //   Key: s3Key,
    //   Body: modifiedPdfBytes,
    //   ContentType: 'application/pdf',
    //   Metadata: {
    //     'customer-name': fullName,
    //     'customer-email': email,
    //     'signature-date': timestamp,
    //     'client-ip': clientIP,
    //     'original-template': 'service-agreement-v1.pdf'
    //   }
    // });

    // await s3Client.send(uploadCommand);

    // Generate S3 URL
    // const s3Url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    const s3Url = "deomo_url";

// Serialize the PDF
const modifiedPdfBytes = await pdfDoc.save();

// Generate unique filename
const fileName = `signed-agreement-${fullName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;

// Save locally to /public/signed-agreements
const localDir = path.join(process.cwd(), 'public', 'signed-agreements');
fs.mkdirSync(localDir, { recursive: true }); // ensure folder exists
const localPath = path.join(localDir, fileName);
fs.writeFileSync(localPath, modifiedPdfBytes);

// Local URL (Next.js serves everything under /public as static files)
const signedPdfUrl = `/signed-agreements/${fileName}`;

    // Log the agreement signing (you can replace this with database storage later)
    const agreementLog = {
      customerName: fullName,
      customerEmail: email,
      signatureDate: timestamp,
      clientIP,
      s3Url,
      timestamp: new Date().toISOString()
    };

    console.log('Agreement signed successfully:', agreementLog);

    // You can also save to a JSON file for now
    const logFilePath = path.join(process.cwd(), 'agreement-logs.json');
    let logs = [];
    
    try {
      if (fs.existsSync(logFilePath)) {
        const existingLogs = fs.readFileSync(logFilePath, 'utf-8');
        logs = JSON.parse(existingLogs);
      }
    } catch (error) {
      console.warn('Could not read existing logs, starting fresh');
    }

    logs.push(agreementLog);
    
    try {
      fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.warn('Could not write to log file:', error);
    }

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



