import { NextResponse } from "next/server"
import { authenticate } from "../../../lib/jwt";

export const GET = async () => {
    try {
        const user = await authenticate();
        if (user) {
            return NextResponse.json({
                message: "Login successful",
            });
        } else {
            return NextResponse.json({
                message: "Nah nah honey I'm good"
            }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Nah nah there was an error",
            error
        }, { status: 400 });
    }
}
