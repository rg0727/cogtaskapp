import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate fetching iris data (replace this with actual logic)
    const irisData = {
      success: true,
      img: "https://placekitten.com/400/300", // Replace with actual image URL or data paramater
    };
    console.log("✅ Iris data prepared:", irisData);

    return NextResponse.json(irisData);
  } catch (error) {
    console.error("Error fetching iris data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch iris data" },
      { status: 500 }
    );
  }
}

// send image to iris
export async function POST(request: Request) {
  try {
    const { img } = await request.json();

    // Simulate processing iris data (replace this with actual logic)
    const irisData = {
      success: true,
      img,
      // Add other properties if needed
    };

    return NextResponse.json(irisData);
  } catch (error) {
    console.error("Error processing iris data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process iris data" },
      { status: 500 }
    );
  }
}
