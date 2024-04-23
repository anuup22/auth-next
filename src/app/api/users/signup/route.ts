import { connectDB } from "@/db/db.config"; // Connect to MongoDB
import User from "@/models/user.model"; // User model
import { NextRequest, NextResponse } from "next/server" 
import bcryptjs from "bcryptjs"; // Hashing password
import { sendEmail } from "@/helpers/mailer"; 

connectDB() // Connect to MongoDB

export const POST = async (req: NextRequest) => {
    try {
        // Get request body
        const reqBody = await req.json();
        const { username, email, password } = reqBody;
        console.log("reqBody", reqBody);
        // TODO: write validation later

        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        // Encrypt password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save user to database
        const savedUser = await newUser.save();
        console.log("savedUser", savedUser);

        // send verification email
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

        return NextResponse.json({ 
            message: "User created successfully",
            success: true,
            savedUser
        }, { status: 201 });
    }
    catch (error: any) {
        return NextResponse.json({ error: `Error signing up -> ${error.message}`}, { status: 500 });
    }
}