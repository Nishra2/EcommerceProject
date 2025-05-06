import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all products to get their categories
    const products = await prisma.product.findMany();
    
    // Extract and deduplicate categories
    const categories = [...new Set(products.map(product => (product as any).category))];
    
    // Filter out empty categories if needed
    const validCategories = categories.filter(category => category && category !== "uncategorized");
    
    return NextResponse.json(validCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}