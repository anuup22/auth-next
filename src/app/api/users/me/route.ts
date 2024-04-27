import { connectDB } from "@/db/db.config";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server" 
import { getUser } from "@/helpers/getUser";

connectDB()

export const POST = async (req: NextRequest) => {
    //extract data from token
    const userId = await getUser(req);

    const user = await User.findOne({ _id: userId}).select("-password");
    if(!user) {
        return NextResponse.json({ error: "User not found" });
    }
    
    return NextResponse.json({ message: "User found", data: user });
}