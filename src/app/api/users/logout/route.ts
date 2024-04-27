import { connectDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server" 

connectDB()

export const GET = async (req: NextRequest) => {
    try {
        const response = NextResponse.json({ message: "Logout successful", success: true });

        response.cookies.set("auth", "", {httpOnly: true, expires: new Date(0)});
        return response;
    }
    catch (error: any) {
        return NextResponse.json({ error: `Error logging out -> ${error.message}`}, { status: 500 });
    }
}