import { NextResponse } from "next/server";
import { authenticate } from "../../../lib/jwt";
import { prisma } from "../../../server/db";

export const POST = async (req) => {
    try {
        const { questions, topic } = await req.json();
        const user = await authenticate();

        await Promise.all(questions.map(async (question) => {
            await prisma.userQuestions.create({
                data: {
                    userId: user.userId,
                    questionText: question.question_text,
                    options: question.options,
                    correctOptionIndex: question.correct_option_index,
                    selectedOptionIndex: question.selectedOptionIndex,
                    isCorrect: question.isCorrect,
                    topic: topic
                }
            });
        }));

        return NextResponse.json({ message: "Questions saved successfully" });
    } catch (error) {
        console.error('Error saving questions:', error);
        return NextResponse.json({ message: "Error saving questions", error: error.message }, { status: 500 });
    }
}