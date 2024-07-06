// pages/api/users.js
import { Connect } from '@/lib/db';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

Connect();

export async function GET(request: NextRequest) {
    try {
        // Fetch all users from MongoDB
        const users = await User.find({});
        
        // Return users list as JSON response
        return NextResponse.json(users);
    } catch (error: any) {
        // Handle errors and return error response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
