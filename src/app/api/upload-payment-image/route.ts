import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExtension = file.name.split(".").pop();
    const cleanFileName = `payment_receipts/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const blob = await put(cleanFileName, buffer, { access: "public" });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error("Upload payment image error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload payment image" }, { status: 500 });
  }
}
