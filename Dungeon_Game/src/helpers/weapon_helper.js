import Base from './base';
import PlayerHelper from './player_helper';
import {WEAPON} from '../configs/game_config';

const {
    WEAPONS_PER_LEVEL, 
    WEAPON_NAME,
    WEAPON_LEGENDARY_NAME,
    WEAPON_ATTACK_BASE, 
    WEAPON_BONUS_PER_LEVEL
} = WEAPON



class WeaponHelper extends Base {
    constructor(){
        super();

        this.CreateWeapons = this.CreateWeapons.bind(this);
        this.InitPlayerWeapon = this.InitPlayerWeapon.bind(this);
        this.onLandingEffect = this.onLandingEffect.bind(this);
    }

    CreateWeapons(board){
        this.CreateFeature(board, WEAPONS_PER_LEVEL, this.Register)
    }

    Register(board, {rowIndex, colIndex}){
        try {
            board[rowIndex][colIndex].weapon = true;
            return true;
        }
        catch(err){
            // console.error('Error Weapon register:', err);
            return false;
        }
    }

    InitPlayerWeapon(){
        const initialLevel = 0;
        return this.CalculateWeapon(initialLevel);
    }

    CalculateWeapon(level){
        let name = '';
        if (level > WEAPON_NAME.length - 1){
            name = `${WEAPON_LEGENDARY_NAME} Level ${level - WEAPON_NAME.length + 1}`
        }
        else {
            name = WEAPON_NAME[level];
        }
        
        const attack = WEAPON_ATTACK_BASE + level * WEAPON_BONUS_PER_LEVEL;

        return {name ,level, attack};
    }

    onLandingEffect(player, board, {rowIndex, colIndex}, canMove){
        let nextCell = board[rowIndex][colIndex];
        if (!nextCell || !nextCell.weapon){
            return {player, board, canMove};
        }

        player.weapon = this.CalculateWeapon(player.weapon.level + 1);

        player.attack = PlayerHelper.CalculatePlayerAttack(player);

        delete board[rowIndex][colIndex].weapon;

        return {player, board, canMove};
    }
}

export default new WeaponHelper();