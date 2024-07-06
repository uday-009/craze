import mongoose from "mongoose";

export interface GameDocument extends Document {
    gameName: string;
    startTime: string;
    endTime: string;
    interval: number;
    icon: string;
    dates: {
        [date: string]: {
            [time: string]: string;
        };
    };
}


const gameSchema = new mongoose.Schema({
    gameName: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    interval: { type: Number, required: true },
    icon: { type: String, required: true },
    dates: {
        type: Map,
        of: {
            type: Map,
            of: String 
        },
        required: true
    }
});

const Game = mongoose.models.Game || mongoose.model<GameDocument>("Game", gameSchema);

export default Game;