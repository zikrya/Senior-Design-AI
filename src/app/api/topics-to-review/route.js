import { NextResponse } from "next/server";
import { authenticate } from "../../../lib/jwt";
import { prisma } from "../../../server/db";

export const GET = async (req) => {
    try {
        const user = await authenticate();
        if (!user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 400 })
        }
        const topicsWithWrongAnswers = await prisma.userQuestions.groupBy({
            by: ['topic'],
            where: {
                userId: user.userId,
                isCorrect: false,
            },
            _count: {
                id: true,
            },
            having: {
                id: {
                    _count: {
                        gte: 3
                    }
                }
            },
        });

        return NextResponse.json(topicsWithWrongAnswers.map(topic => topic.topic));
    } catch (error) {
        console.error('Error fetching topics to review:', error);
        return NextResponse.json({ message: "Error fetching topics to review" }, { status: 500 });
    }
}