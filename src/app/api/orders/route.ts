import { NextResponse } from "next/server";
import { PrismaClient, Order } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "unauthorized user"}, {status: 401});

        }

        const orders = await prisma.order.findMany({
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            
          });
          return NextResponse.json(orders);

    } catch (errors) {
        console.error(errors);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}