import { NextResponse } from "next/server";
import { authenticate } from "../../../lib/jwt";
import { prisma } from "../../../server/db";

export const GET = async (req) => {
    try {
        const user = await authenticate();

        const userQuestions = await prisma.userQuestions.findMany({
            where: {
                userId: user.userId
            }
        });
        return NextResponse.json(userQuestions);
    } catch (error) {
        console.error('Error fetching user questions:', error);
        return NextResponse.json({ message: "Error fetching user questions :(" }, { status: 500 });
    }
}