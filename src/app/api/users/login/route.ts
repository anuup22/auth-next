import { connectDB } from "@/db/db.config";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server" 
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB()

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log("User found");

        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1d" });

        const response = NextResponse.json({ message: "Login successful", success: true, token });

        response.cookies.set("authToken", token, {httpOnly: true});
        return response;
    }
    catch (error: any) {
        return NextResponse.json({ error: `Error signing up -> ${error.message}`}, { status: 500 });
    }
}
            