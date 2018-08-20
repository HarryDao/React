import HelperBase from './base';
import {POTION} from '../configs/game_config';

const {POTIONS_PER_LEVEL, POTION_RECOVERY_BASE, POTION_RECOVERY_VARIETY} = POTION;

class PotionHelper extends HelperBase {
    constructor(){
        super();
        this.CreatePotions = this.CreatePotions.bind(this);
        this.Register = this.Register.bind(this);
    }

    CreatePotions(board){
        this.CreateFeature(board, POTIONS_PER_LEVEL, this.Register)
    }   

    Register(board, {rowIndex, colIndex}){
        try {
            const value = this.AssignRandom(POTION.POTION_RECOVERY_BASE, POTION.POTION_RECOVERY_VARIETY);
            board[rowIndex][colIndex].potion = value;
            return true;
        }
        catch(err){
            // console.error('Error assign Potion:', err);
            return false;
        }
    }

    onLandingEffect(player, board, {rowIndex, colIndex}, canMove){
        let nextCell = board[rowIndex][colIndex];
        if (!nextCell || !nextCell.potion){
            return {player, board, canMove};
        }

        player.health += nextCell.potion;

        delete board[rowIndex][colIndex].potion;
        return {player, board, canMove};
    }
}

export default new PotionHelper();