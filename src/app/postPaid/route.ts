import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    console.log("Received text:", text);

    return NextResponse.json(
      { message: "Text received successfully", text },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing text:", error);
    return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
  }
}
