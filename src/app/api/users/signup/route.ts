import {Connect} from "@/lib/db";
import User from "@/models/user";
import {NextRequest, NextResponse} from "next/server";
import bcrypt from 'bcryptjs';
import zod from 'zod';

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
	email: zod.string().email()
});

Connect();

export async function POST(request: NextRequest) {
	try {
		//getting data form frontend body
		const reqBody = await request.json();

		const { success } = signupSchema.safeParse(reqBody);

		if (!success) {
			return NextResponse.json({
				message: "Email already taken / Incorrect inputs"
			})
		}
		//destructure the data form reqBody
		const {username, email, password, firstName, lastName} = reqBody;

		//check if the user is exists
		const user = await User.findOne({email});
		console.log(user);
		if (user) {
			return NextResponse.json({error: "User already exists"}, {status: 400});
		}

		//hashing password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({username, email, password: hashedPassword, firstName, lastName});

		const savedUser = await newUser.save();
		console.log(savedUser);

		return NextResponse.json({
			message: "User created successfully",
			success: true,
			savedUser,
		});
	} catch (error: any) {
		return NextResponse.json({error: error.message, "message": "some error"}, {status: 500});
	}
}
