import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const fileName = (file as any).name;
    const fileType = (file as any).type;

    const files = await Promise.all(
      Array.from(formData.getAll("file") as Blob[]).map(async (file) => {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const fileName = (file as any).name;
        const fileType = (file as any).type;

        return prisma.file.create({
          data: {
            name: fileName,
            type: fileType,
            data: bytes,
          },
        });
      })
    );

    const fileIds = files.map((file) => file.id);

    return NextResponse.json(
      { message: "Files uploaded successfully", fileIds: fileIds },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
