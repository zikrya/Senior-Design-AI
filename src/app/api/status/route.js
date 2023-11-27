import { NextResponse } from "next/server";
import { prisma } from "../../../server/db";

export const GET = async () => {
    const users = await prisma.user.count();
    return NextResponse.json({
        success: true,
        data: { users }
    })
}