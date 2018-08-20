import Base from './base';
import {GAME} from '../configs/game_config';

const {GAME_TOTAL_LEVELS} = GAME;

class DoorHelper extends Base {
    constructor(){
        super();
        this.CreateDoor = this.CreateDoor.bind(this);
    }
    CreateDoor(board, gameLevel){
        if (gameLevel < GAME_TOTAL_LEVELS){
            this.CreateFeature(board, 1, this.Register);
        }
    }
    Register(board, {rowIndex, colIndex}){
        try {
            board[rowIndex][colIndex].door = true;
            return true;
        }
        catch(err){
            // console.error('Error Create Door:', err);
            return false;
        }
    }
}

export default new DoorHelper();