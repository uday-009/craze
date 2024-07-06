import resUtility from '@/app/utils/utilities';
import { Connect } from '@/lib/db';
import Game from '@/models/game';
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '../../../../middleware/auth.middleware'
import moment from 'moment';

Connect();

export async function POST(req: NextRequest, res: NextResponse ) {
    try {
        // Execute the authentication middleware
        const reqBody = await req.json();



        
        // console.log('after', reqBody)
        // Destructure request body to extract game details
        const { gameName, startTime, endTime, interval, icon, dates } = reqBody;

        const today = moment().format('YYYY-MM-DD');
        
        // Initialize an empty object for today's intervals
        const todayIntervals: { [key: string]: string } = {};

        // Generate the intervals for today's date
        let currentTime = moment(startTime, 'HH:mm');
        const endTimeMoment = moment(endTime, 'HH:mm');
        while (currentTime <= endTimeMoment) {
            todayIntervals[currentTime.format('HH:mm')] = "";
            currentTime = currentTime.add(interval, 'minutes');
        }

    
        // Add today's date with the generated time slots to the dates object
        const updatedDates = {[today]: todayIntervals };

        const newGame = new Game({
            gameName,
            startTime,
            endTime,
            interval,
            icon,
            dates: updatedDates
        });

        // // Save the new game to your MongoDB database
        await newGame.save();
        // console.log(newGame, "newGame")

        // Return a successful response
        return NextResponse.json(resUtility.responseObj(true, "New game added successfully"));
    } catch (error: any) {
        // Handle errors and return error response
        return NextResponse.json(resUtility.responseObj(false, "some error occurred", { error: error.message } ), { status: 500 })
    }
}
