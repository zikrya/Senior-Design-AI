import { NextResponse } from "next/server";
import { authenticate } from "../../../lib/jwt";
import { prisma } from "../../../server/db";

export const GET = async () => {
    try {
        const user = await authenticate();
        if (!user) {
            return NextResponse.json(
                { message: "Failed to authenticate!" },
                { status: 401 }
            );
        }

        const userProfile = await prisma.user.findUnique({
            where: {
                id: user.userId
            }
        });

        return NextResponse.json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { message: "Error fetching user profile :(" },
            { status: 500 }
        );
    }
};