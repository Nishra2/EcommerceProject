import { NextResponse } from "next/server";
import { PrismaClient, Product } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const isFeaturedParam = url.searchParams.get('isFeatured');
  
  // Define a base query options object
  const queryOptions: any = {};
  
  // Add the where clause conditionally
  if (isFeaturedParam !== null) {
    queryOptions.where = {
      isFeatured: isFeaturedParam === 'true'
    };
  }
  
  const products = await prisma.product.findMany(queryOptions);
  return NextResponse.json(products);
}
async function isAdmin(session: any) {
  return session?.user?.role === "ADMIN";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const product: Product = await request.json();

  const createdProduct = await prisma.product.create({ data: product });
  return NextResponse.json(createdProduct, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const updatedProduct: Product = await request.json();
  const product = await prisma.product.update({
    where: { id: updatedProduct.id },
    data: updatedProduct,
  });
  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: "Product deleted" });
}
