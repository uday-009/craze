import resUtility from '@/app/utils/utilities';
import { Connect } from '@/lib/db';
import Game from '@/models/game';
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '../../../../middleware/auth.middleware'

Connect();

export async function GET(req: NextRequest, res:NextResponse, next: () => void ) {
    try {


        console.log('after')
        const games = await Game.find({});

        console.log('games', games)
        
        // Return users list as JSON response
        return NextResponse.json(resUtility.responseObj(true, "games list", { games } ));
    } catch (error: any) {
        // Handle errors and return error response
        return NextResponse.json(resUtility.responseObj(false, "some error occurred", { error: error.message } ), { status: 500 })
    }
}
