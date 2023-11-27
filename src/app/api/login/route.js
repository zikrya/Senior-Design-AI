import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "../../../server/db";
import * as jwt from "jsonwebtoken";

export const POST = async (req) => {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 });
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({
                message: "Invalid credentials"
            }, { status: 401 });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return NextResponse.json({ message: "Login successful", token });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: "Error logging in user" },
            { status: 500 }
        );
    }
}