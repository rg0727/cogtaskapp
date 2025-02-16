import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  request: Request,
  { params }: { params: { imageUrl: string } }
) {
  const { imageUrl } = params;

  // Define the path to the requested image
  const filePath = path.join(process.cwd(), "../../public/", imageUrl);
  console.log(filePath);

  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Read the image file
    const fileBuffer = fs.readFileSync(filePath);

    // Return the image as a response
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
