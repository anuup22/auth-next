import { connectDB } from "@/db/db.config"; 
import User from "@/models/user.model"; 
import { NextRequest, NextResponse } from "next/server" 

connectDB() 

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();
        const { token } = reqBody;
        console.log(token);

        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return NextResponse.json({ error: "Invalid token or token expired" }, { status: 400 });
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({ message: "Email verified successfully", success: true }, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ error: `Error signing up -> ${error.message}`}, { status: 500 });
    }
}