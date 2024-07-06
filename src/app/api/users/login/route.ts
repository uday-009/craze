import {Connect} from "@/lib/db";
import User from "@/models/user";
import {NextRequest, NextResponse} from "next/server";
import bcrypt from 'bcryptjs';
import zod from 'zod';
const jwt = require('jsonwebtoken');
import { JWT_SECRET } from '../../../../../config'
import resUtility from "@/app/utils/utilities";



const loginSchema = zod.object({
    email: zod.string(),
    password: zod.string(),
});

Connect();

export async function POST(request: NextRequest) {
	try {
		//getting data form frontend body
		const reqBody = await request.json();

        const { success } = loginSchema.safeParse(reqBody);

        if (!success) {
            return NextResponse.json({
                message: "Incorrect credentials"
            }, {status: 400})
        }
		
		const {email, password, username} = reqBody;

		let user;
        if(email){
            user = await User.findOne({email}).select("+password");
        }else{
            user = await User.findOne({username}).select("+password");
        }

        if(!user){
            return NextResponse.json(resUtility.responseObj(false, "User doesnot exist"))
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return NextResponse.json(resUtility.responseObj(false, "Invalid credentials"), {status: 401})
        }
    
        // Return user details (excluding password) and optionally a JWT token
        
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET);
        
        return NextResponse.json(resUtility.responseObj(true, "Login sucessful", {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
              },
              token
        }), { status: 200 })
       

	
	} catch (error: any) {
		return NextResponse.json({error: error.message}, {status: 500});
	}
}
