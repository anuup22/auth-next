import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getUser = (req: NextRequest) => {
    try {
        const token = req.cookies.get("authToken")?.value || "";
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        
        return decodedToken.id;
    } 
    catch (error: any) {
        throw new Error(error.message);
    }
};