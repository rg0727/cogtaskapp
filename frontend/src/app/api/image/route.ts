// In your Next.js API route (e.g., pages/api/get-image/[imageName].ts)

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request: Request, { params }: { params: { imageName: string } }) {
  const { imageName } = params;

  // Define the path to the image in the backend folder
  const filePath = path.join(process.cwd(), "api", "backend", "data", imageName);
  console.log(filePath); // Optional: For debugging

  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Read the image file
    const fileBuffer = fs.readFileSync(filePath);

    // Set appropriate content type for image
    const fileExtension = path.extname(imageName).toLowerCase();
    const contentType =
      fileExtension === ".png" ? "image/png" : fileExtension === ".jpg" || fileExtension === ".jpeg" ? "image/jpeg" : "application/octet-stream";

    // Return the image as a response
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
