import resUtility from "@/app/utils/utilities";
import { NextRequest, NextResponse } from "next/server";

const jwt = require('jsonwebtoken');
import { jwtVerify } from 'jose';

import { JWT_SECRET } from "../config";

interface CustomHeaders extends Headers {
    authorization?: string;
}

interface CustomRequest extends NextRequest {
    headers: CustomHeaders;
    userId?: string;
}

interface JwtPayload {
    id: string;
}


const protectedRoutes = [
    '/api/dashboard/newgame',
]
export const middleware = async (req:  CustomRequest , res: NextResponse, next: any) => {

    
    
    const pathname = req.nextUrl.pathname;
    
    
    if (protectedRoutes.includes(pathname)) {
        const authHeader = req.headers.get('authorization');
        
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return NextResponse.json({message: 'token error'}, {status: 403})
        }
        
        const token = authHeader.split(" ")[1];
        
        if (!token){
            console.error('token error')
            return NextResponse.redirect(new URL("/login", req.url));
        }
        try {

            console.log( "decodeffffffffffffd")
            const {payload} = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET)) as { payload : JwtPayload}
            
            console.log(payload, "decoded")
            if(payload.id){
                req.userId = payload.id;
                return NextResponse.next();
            }else{
                return NextResponse.json( resUtility.responseObj(false, "some auth error", {}), {status: 403})
            }
        } catch (error) {
            console.error(error, 'error')
        }
    }else{
        return NextResponse.next();
    }
    

}

