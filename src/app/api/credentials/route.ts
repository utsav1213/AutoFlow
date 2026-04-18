import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    const body = await req.json();
    const credential = await prisma.credential.create({
        data: {
            type: body.type,
            data:body.data
        }
    });
return NextResponse.json(credential)
}