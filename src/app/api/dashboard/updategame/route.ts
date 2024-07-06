import resUtility from '@/app/utils/utilities';
import { Connect } from '@/lib/db';
import Game from '@/models/game';
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '../../../../middleware/auth.middleware'

Connect();

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    // Execute the authentication middleware
    const reqBody = await req.json();

    // Destructure request body to extract updated game details
    const { _id, gameName, startTime, endTime, interval, icon, dates } = reqBody;

    // Find the game by ID
    const game = await Game.findById(_id);
    if (!game) {
      return NextResponse.json(resUtility.responseObj(false, "Game not found"), { status: 404 });
    }

    // Update the game with the new data
    // game.gameName = gameName;
    // game.startTime = startTime;
    // game.endTime = endTime;
    // game.interval = interval;
    // game.icon = icon;
    game.dates = dates;

    // Save the updated game object to the database
    await game.save();

    // Return a successful response
    return NextResponse.json(resUtility.responseObj(true, "Game updated successfully"));
  } catch (error: any) {
    // Handle errors and return error response
    return NextResponse.json(resUtility.responseObj(false, "Some error occurred", { error: error.message }), { status: 500 });
  }
}
