import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  try {
    // Extract image name from query parameters
    const { image } = req.query;

    if (!image) {
      return res.status(400).send("No image name provided");
    }

    // Define the path to the image in the backend folder
    const filePath = path.join(process.cwd(), "..", "api", "backend", "data", image);
    console.log("File path:", filePath); // Log the file path

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found at path:", filePath);
      return res.status(404).send("File not found");
    }

    // Read the image file
    const fileBuffer = fs.readFileSync(filePath);

    // Set appropriate content type for image
    const fileExtension = path.extname(image).toLowerCase();
    const contentType =
      fileExtension === ".png"
        ? "image/png"
        : fileExtension === ".jpg" || fileExtension === ".jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

    // Return the image as a response
    res.setHeader("Content-Type", contentType);
    return res.status(200).send(fileBuffer);
  } catch (error) {
    console.error("Error reading file:", error);
    console.error(error.stack);
    return res.status(500).send("Internal Server Error");
  }
}
