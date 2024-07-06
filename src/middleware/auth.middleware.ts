import resUtility from "@/app/utils/utilities";
import { NextRequest, NextResponse } from "next/server";

const jwt = require('jsonwebtoken');

import { JWT_SECRET } from "../../config";

interface CustomHeaders extends Headers {
    authorization?: string;
}

interface CustomRequest extends NextRequest {
    headers: CustomHeaders;
    userId?: string;
}

export const authMiddleware = (req:  CustomRequest , res: NextResponse, next: any) => {

    
    const authHeader = req.headers.authorization;

    console.log(authHeader, 'authHeader')
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return NextResponse.json({message: 'token error'}, {status: 403})
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        }else{
            return NextResponse.json( resUtility.responseObj(false, "some auth error", {}), {status: 403})
        }
    } catch (error) {
        console.error(error, 'error')
    }

}

