import { hash } from "bcryptjs";
import { NextResponse } from 'next/server';
import { prisma } from "../../../server/db";

export const POST = async (req) => {
    try {
        const { email, firstName, lastName, college, password } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already in use" },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                college,
                password: hashedPassword,
            },
        });


        return NextResponse.json(
            { message: "User created" },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: "Error logging in user" },
            { status: 500 }
        );
    }
};
